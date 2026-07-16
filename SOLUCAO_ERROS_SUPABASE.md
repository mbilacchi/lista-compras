# 🔧 Solução: Erros de Reset de Senha e Signup

## 🔴 Problemas Identificados

### Problema 1: Reset de Senha com Hash Routing
**Arquivo:** `src/lib/auth.ts:48`

**Causa:** Supabase redireciona de um email para o app usando hash routing (`#/reset-password-confirm`), o que pode não funcionar corretamente.

**Solução:** Mudar para path routing sem hash.

---

### Problema 2: Confirmação de Email Obrigatória no Supabase
**Arquivo:** Configuração do Supabase

**Causa:** Por padrão, Supabase pode exigir confirmação de email antes de permitir login. Isso impede novo usuários de fazer login logo após signup.

**Solução:** Desabilitar confirmação de email obrigatória no Supabase.

---

## ✅ PASSO A PASSO PARA RESOLVER

### PASSO 1: Corrigir Redirect URL do Reset de Senha

**Arquivo a modificar:** `src/lib/auth.ts`

**Linha 46-52, mude de:**
```typescript
export async function resetPasswordEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#/reset-password-confirm`,
  })

  if (error) throw error
}
```

**Para:**
```typescript
export async function resetPasswordEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password-confirm`,
  })

  if (error) throw error
}
```

**O que mudou:**
- Removeu o `#/` 
- Agora é `/reset-password-confirm` em vez de `#/reset-password-confirm`

---

### PASSO 2: Desabilitar Confirmação de Email no Supabase

**Acesso:**
1. Abra https://supabase.com
2. Login com sua conta
3. Vá para seu projeto
4. Menu esquerdo → "Authentication"
5. Clique em "Providers" → "Email"
6. Procure por "Confirm email"
7. Altere para: **"Disabled"** ou **"Enabled"** (com auto-confirm)

**Recomendação:** Deixar em "Enabled" com confirmação automática para melhor segurança.

---

### PASSO 3: Configurar Redirect URL no Supabase

**Autorizar novo URL:**
1. No Supabase, vá para "Project Settings"
2. Clique em "Auth"
3. Procure por "Redirect URLs" ou "Allowed Redirect URLs"
4. Adicione: `https://6a582613aebae39f0ef3906f--bright-meringue-a7ff01.netlify.app/reset-password-confirm`
5. **Também adicione:** `http://localhost:5173/reset-password-confirm` (para testes locais)
6. Salve as mudanças

---

### PASSO 4: Atualizar Código (Opcional)

Se o Supabase exigir caminhos absolutos, também atualize o arquivo de redirect:

**Arquivo:** `netlify.toml` - Adicione:
```toml
[[redirects]]
  from = "/#/reset-password-confirm"
  to = "/reset-password-confirm"
  status = 200

[[redirects]]
  from = "/#/reset-password-confirm*"
  to = "/reset-password-confirm"
  status = 200
```

---

## 🧪 TESTE APÓS CORREÇÕES

### Teste 1: Reset de Senha
1. Acesse https://seu-app.netlify.app/reset-password
2. Digite um email (pode ser o seu)
3. Clique "Enviar Email de Reset"
4. Verifique a caixa de entrada
5. Clique no link do email
6. **Deve ir para `/reset-password-confirm`**

### Teste 2: Signup
1. Acesse https://seu-app.netlify.app/registro
2. Preencha com:
   - Email: `novo.usuario@gmail.com`
   - Senha: `Teste123456!`
   - Role: Criador
3. Marque termo de uso
4. Clique "Criar Conta"
5. **Deve redirecionar para home (signup bem-sucedido)**

---

## 📋 CHECKLIST DE RESOLUÇÃO

- [ ] Editei `src/lib/auth.ts` (removido `#/`)
- [ ] Acessei Supabase Dashboard
- [ ] Desabilitei confirmação de email obrigatória
- [ ] Adicionei Redirect URLs no Supabase
- [ ] Fiz redeploy no Netlify
- [ ] Testei reset de senha
- [ ] Testei signup com novo usuário
- [ ] Testei login com novo usuário

---

## 🚀 PRÓXIMOS PASSOS

1. **Aplicar as correções acima**
2. **Fazer commit e push:**
   ```bash
   git add src/lib/auth.ts
   git commit -m "Fix: Remove hash routing from password reset redirect"
   git push
   ```
3. **Redeploy no Netlify** (automático após push)
4. **Esperar 2-3 minutos**
5. **Testar novamente**

---

## ⚠️ SE AINDA NÃO FUNCIONAR

Se após essas mudanças ainda houver erro:

1. Verifique o console do navegador (F12)
2. Procure por erro específico do Supabase
3. Verifique se as Redirect URLs estão corretas no Supabase
4. Teste localmente (`npm run dev`) para descartar problemas do Netlify

---

**Quer que eu aplique essas correções para você?** 🚀
