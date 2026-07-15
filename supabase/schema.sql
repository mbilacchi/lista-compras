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

-- ------------------------------------------------------------
-- Realtime: permite acompanhar o progresso da separação ao vivo.
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.listas;
alter publication supabase_realtime add table public.lista_itens;

-- ------------------------------------------------------------
-- Segurança (RLS) — MVP sem login.
-- ------------------------------------------------------------
-- O app não tem cadastro/login: qualquer pessoa com o link acessa a lista.
-- Para o MVP, liberamos acesso público (anon) de leitura e escrita.
-- ATENÇÃO: qualquer um que descubra um id de lista pode ler/editar.
-- Isso é aceitável para testar com usuários, mas NÃO para produção real.
-- Evoluções futuras: token secreto por lista, ou expiração das listas.
alter table public.listas     enable row level security;
alter table public.lista_itens enable row level security;

create policy "acesso_publico_listas"
  on public.listas
  for all
  to anon
  using (true)
  with check (true);

create policy "acesso_publico_lista_itens"
  on public.lista_itens
  for all
  to anon
  using (true)
  with check (true);
