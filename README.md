# Lista de Compras 🛒

App web para criar e gerenciar listas de compras com dois papéis:

- **Criador de Lista** — monta a lista (descrição, marca, unidade, quantidade) e envia o link por WhatsApp.
- **Comprador** — abre o link no mercado, marca os itens como pegos ou em falta (com marca alternativa) e o Criador acompanha o progresso on-line.

> Este repositório contém a **estrutura inicial** do projeto. As telas ainda serão construídas.

## Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (mobile-first)
- [Supabase](https://supabase.com/) (banco de dados + realtime, compartilha dados entre celulares)
- Deploy na [Netlify](https://www.netlify.com/)

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o Supabase:
   - Crie um projeto gratuito em [supabase.com](https://supabase.com/).
   - Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
     (encontre em *Project Settings > API*).

3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Build de produção

```bash
npm run build
npm run preview   # testa o build localmente
```

## Publicar na Netlify

1. Suba o projeto para um repositório Git (GitHub/GitLab).
2. Na Netlify: *Add new site > Import an existing project*.
3. O `netlify.toml` já define o build (`npm run build`) e a pasta de publicação (`dist`).
4. Em *Site settings > Environment variables*, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## Estrutura de pastas

```
src/
  components/   # componentes reutilizáveis (a criar)
  pages/        # telas da aplicação (a criar)
  lib/          # cliente Supabase
  types/        # tipos do domínio (Lista, ListaItem, etc.)
```
