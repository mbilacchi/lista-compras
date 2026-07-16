# 📋 Instruções de Deploy Manual no Netlify

## Problema Atual
O Netlify não está fazendo redeploy automático mesmo após múltiplos commits no GitHub.

## Solução: Redeploy Manual

### Passo 1: Acessar Netlify Dashboard
1. Abra: https://app.netlify.com
2. Faça login com sua conta

### Passo 2: Selecionar Site
1. Procure por: **"lista-compras"** ou **"bright-meringue-a7ff01"**
2. Clique para abrir o site

### Passo 3: Fazer Redeploy
1. Procure pela seção **"Deploys"**
2. Você verá um histórico de deploys
3. Procure por um botão que diz **"Trigger deploy"** ou **"Retry deploy"**
4. Clique nele
5. Selecione a opção **"Clear cache and deploy site"**

### Passo 4: Aguardar Build
- O build deve demorar 2-5 minutos
- Você verá o status mudando: "Building" → "Deployed"
- Quando terminar, o site será atualizado automaticamente

### Passo 5: Verificar Deploy
1. Após o deploy, acesse o site: https://6a582613aebae39f0ef3906f--bright-meringue-a7ff01.netlify.app/login
2. Tente fazer login
3. Se funcionar sem erro "Failed to fetch", o deploy foi bem-sucedido! ✅

## Alternativa: Usar Netlify CLI

Se preferir usar linha de comando:

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Fazer deploy (na pasta do projeto)
cd C:\Users\marce\OneDrive\Desktop\lista-compras
netlify deploy --prod
```

## Se Ainda Não Funcionar

1. **Verificar Logs do Build:**
   - No Netlify Dashboard
   - Seção "Deploys"
   - Clique no deploy mais recente
   - Abra "Deploy log"
   - Procure por erros (red text)

2. **Possíveis Erros:**
   - ❌ `npm run build` falhando → Verificar dependências
   - ❌ Variáveis de ambiente não definidas → Configurar no Netlify
   - ❌ Build OK mas site não funciona → Aguardar propagação do cache

3. **Última Opção:**
   - Reconectar GitHub no Netlify
   - Dashboard → Site settings → Build & deploy → GitHub
   - Desconectar e conectar novamente

## Status Esperado Após Deploy

✅ Nenhum erro "Failed to fetch"
✅ Página de login carrega sem erro
✅ Login e signup funcionam
✅ Dashboard admin acessível

---

**Dataexecução:** 2026-07-16
**Sistema:** 100% funcional localmente
**Deploy:** Aguardando redeploy manual no Netlify
