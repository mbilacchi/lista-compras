# 🚀 Guia de Deployment - Lista de Compras

## Pré-requisitos
- Conta GitHub (https://github.com)
- Conta Netlify (https://netlify.com)
- Git instalado localmente

## Passo 1: Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `lista-compras`
3. Descrição: "App web para gerenciar lista de compras em tempo real"
4. Escolha "Public"
5. Clique "Create repository"

## Passo 2: Configurar Remote Git e Fazer Push

```bash
# Após criar o repositório, você receberá uma URL como: https://github.com/seu-usuario/lista-compras.git

# No terminal, dentro da pasta lista-compras:
git remote add origin https://github.com/seu-usuario/lista-compras.git
git branch -M main
git push -u origin main
```

## Passo 3: Configurar Variáveis de Ambiente no Netlify

1. Acesse https://app.netlify.com
2. Clique "New site from Git"
3. Conecte sua conta GitHub
4. Selecione o repositório `lista-compras`
5. Configure o build:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Antes de fazer deploy, clique "Advanced build settings" e adicione:

   **Variáveis de Ambiente:**
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```

   *(Pegue essas valores no seu projeto Supabase > Settings > API Keys)*

7. Clique "Deploy site"

## Passo 4: Configurar CORS no Supabase (Importante!)

Para que o upload de fotos funcione a partir do domínio Netlify:

1. No seu projeto Supabase, vá em **Storage > Buckets > fotos-itens**
2. Clique em **Settings**
3. Em **CORS Configuration**, adicione:

```json
[
  {
    "origin": ["https://seu-site.netlify.app"],
    "methods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
    "allowedHeaders": ["*"],
    "exposedHeaders": ["*"],
    "maxAgeSeconds": 3600,
    "credentials": true
  }
]
```

## Passo 5: Testar a Aplicação

1. Acesse a URL gerada pelo Netlify (ex: `https://seu-site.netlify.app`)
2. Crie uma lista e teste o fluxo completo:
   - Criar lista como criador
   - Compartilhar link com comprador
   - Separar itens e capturar fotos
   - Ver relatório final

## 🎯 Resumo das URLs Importantes

| Recurso | URL |
|---------|-----|
| App Publicado | https://seu-site.netlify.app |
| Dashboard Netlify | https://app.netlify.com |
| Projeto Supabase | https://app.supabase.com |
| Repositório GitHub | https://github.com/seu-usuario/lista-compras |

## 🔐 Segurança

- ✅ RLS policies desabilitadas (qualquer um pode acessar - é o objetivo!)
- ✅ Sem login necessário (apenas nomes de usuários)
- ✅ Dados isolados por Lista ID
- ⚠️ Considere re-ativar RLS policies em produção se houver dados sensíveis

## ❓ Troubleshooting

**Problema: "supabaseUrl is required"**
- Verifique se as variáveis de ambiente estão corretas no Netlify
- Faça deploy novamente após adicionar as variáveis

**Problema: Upload de fotos não funciona**
- Verifique a configuração de CORS no Supabase
- Certifique-se de que a URL do Netlify está adicionada

**Problema: Dados não sincronizam em tempo real**
- Verifique se as Realtime subscriptions estão habilitadas no Supabase
- Vá em Settings > Replication e certifique-se de "Realtime Enabled"

---

**Pronto para lançar! 🎉**
