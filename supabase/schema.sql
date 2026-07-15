-- ============================================================
-- Lista de Compras — Esquema do banco (Supabase / PostgreSQL)
-- ------------------------------------------------------------
-- Como usar:
--   1. Abra o painel do seu projeto no Supabase.
--   2. Vá em "SQL Editor" > "New query".
--   3. Cole todo este arquivo e clique em "Run".
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: listas
-- Uma lista criada pelo "Criador" e acessada pelo "Comprador".
-- ------------------------------------------------------------
create table if not exists public.listas (
  id             uuid primary key default gen_random_uuid(),
  criador_nome   text not null,
  comprador_nome text,
  criada_em      timestamptz not null default now(),
  encerrada_em   timestamptz            -- preenchida quando o comprador finaliza (mesmo com faltas)
);

-- ------------------------------------------------------------
-- Tabela: lista_itens
-- Itens de uma lista. Cada item guarda o pedido do Criador e
-- o que o Comprador encontrou no mercado.
-- ------------------------------------------------------------
create table if not exists public.lista_itens (
  id                uuid primary key default gen_random_uuid(),
  lista_id          uuid not null references public.listas(id) on delete cascade,
  descricao         text not null,
  marca             text,
  unidade           text not null default 'un'
                      check (unidade in ('un','kg','g','L','ml','pct','cx','dz')),
  quantidade        numeric not null default 1 check (quantidade > 0),
  status            text not null default 'pendente'
                      check (status in ('pendente','pego','em_falta')),
  marca_alternativa text,               -- marca encontrada na loja, se a solicitada faltou
  criado_em         timestamptz not null default now()  -- usado para ordenar os itens
);

-- Índice para buscar rapidamente os itens de uma lista.
create index if not exists idx_lista_itens_lista_id on public.lista_itens(lista_id);

-- Alterações para autenticação
alter table public.listas add column if not exists criador_id uuid references auth.users(id) on delete cascade;
alter table public.listas add column if not exists comprador_id uuid references auth.users(id) on delete set null;

-- Nova tabela: lista_acesso_compartilhado (permite acesso sem login via token)
create table if not exists public.lista_acesso_compartilhado (
  id uuid primary key default gen_random_uuid(),
  lista_id uuid not null references public.listas(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  exigir_login boolean not null default false,
  criado_em timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists idx_lista_acesso_token on public.lista_acesso_compartilhado(token);
create index if not exists idx_lista_acesso_lista_id on public.lista_acesso_compartilhado(lista_id);

-- Tabela item_fotos (estava faltando no schema)
create table if not exists public.item_fotos (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.lista_itens(id) on delete cascade,
  url text not null,
  criado_em timestamptz not null default now()
);

create index if not exists idx_item_fotos_item_id on public.item_fotos(item_id);

-- ------------------------------------------------------------
-- Realtime: permite acompanhar o progresso da separação ao vivo.
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.listas;
alter publication supabase_realtime add table public.lista_itens;
alter publication supabase_realtime add table public.lista_acesso_compartilhado;
alter publication supabase_realtime add table public.item_fotos;

-- ------------------------------------------------------------
-- Segurança (RLS) — Com autenticação
-- ------------------------------------------------------------
alter table public.listas                      enable row level security;
alter table public.lista_itens                 enable row level security;
alter table public.item_fotos                  enable row level security;
alter table public.lista_acesso_compartilhado  enable row level security;

-- Policies para LISTAS
-- Policy 1: Criador autenticado vê suas próprias listas
drop policy if exists "acesso_publico_listas" on public.listas;
create policy "criador_ve_suas_listas"
  on public.listas
  for select
  to authenticated
  using (auth.uid() = criador_id);

-- Policy 2: Comprador autenticado vê listas onde é comprador
create policy "comprador_ve_listas_atribuidas"
  on public.listas
  for select
  to authenticated
  using (auth.uid() = comprador_id);

-- Policy 3: Admin vê todas as listas
create policy "admin_ve_todas_listas"
  on public.listas
  for select
  to authenticated
  using ((auth.jwt()->'user_metadata'->>'role')::text = 'admin');

-- Policy 4: Acesso público via token compartilhado (sem autenticação)
create policy "acesso_publico_via_token_listas"
  on public.listas
  for select
  to anon
  using (
    exists (
      select 1 from public.lista_acesso_compartilhado
      where lista_acesso_compartilhado.lista_id = public.listas.id
      and (lista_acesso_compartilhado.expires_at is null or lista_acesso_compartilhado.expires_at > now())
    )
  );

-- Policies para ITENS (seguem a lista pai)
drop policy if exists "acesso_publico_lista_itens" on public.lista_itens;

-- Criador e comprador podem ver/editar itens de suas listas
create policy "acesso_itens_via_lista_auth"
  on public.lista_itens
  for all
  to authenticated
  using (
    exists (
      select 1 from public.listas
      where public.listas.id = public.lista_itens.lista_id
      and (auth.uid() = public.listas.criador_id or auth.uid() = public.listas.comprador_id)
    )
  );

-- Admin pode ver/editar todos os itens
create policy "admin_ve_todos_itens"
  on public.lista_itens
  for all
  to authenticated
  using ((auth.jwt()->'user_metadata'->>'role')::text = 'admin');

-- Acesso público via token (apenas leitura)
create policy "acesso_publico_itens_via_token"
  on public.lista_itens
  for select
  to anon
  using (
    exists (
      select 1 from public.listas
      inner join public.lista_acesso_compartilhado on lista_acesso_compartilhado.lista_id = public.listas.id
      where public.listas.id = public.lista_itens.lista_id
      and (lista_acesso_compartilhado.expires_at is null or lista_acesso_compartilhado.expires_at > now())
    )
  );

-- Policies para ITEM_FOTOS (seguem a lista pai)
create policy "acesso_fotos_via_lista"
  on public.item_fotos
  for all
  to authenticated
  using (
    exists (
      select 1 from public.lista_itens
      inner join public.listas on public.listas.id = public.lista_itens.lista_id
      where public.lista_itens.id = public.item_fotos.item_id
      and (auth.uid() = public.listas.criador_id or auth.uid() = public.listas.comprador_id)
    )
  );

create policy "admin_ve_todas_fotos"
  on public.item_fotos
  for all
  to authenticated
  using ((auth.jwt()->'user_metadata'->>'role')::text = 'admin');

-- Policies para LISTA_ACESSO_COMPARTILHADO
-- Criador pode criar/deletar compartilhamentos de suas listas
create policy "criador_gerencia_compartilhamento"
  on public.lista_acesso_compartilhado
  for all
  to authenticated
  using (
    exists (
      select 1 from public.listas
      where public.listas.id = public.lista_acesso_compartilhado.lista_id
      and auth.uid() = public.listas.criador_id
    )
  );

-- Admin pode ver/gerenciar todos os compartilhamentos
create policy "admin_gerencia_compartilhamentos"
  on public.lista_acesso_compartilhado
  for all
  to authenticated
  using ((auth.jwt()->'user_metadata'->>'role')::text = 'admin');
