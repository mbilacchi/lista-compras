import { supabase } from './supabase'
import { UserRole } from '../contexts/AuthContext'

/**
 * Registra um novo usuário
 */
export async function signup(email: string, password: string, role: UserRole) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  })

  if (error) throw error
  return data
}

/**
 * Faz login do usuário
 */
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Faz logout do usuário
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Envia email para reset de senha (magic link)
 */
export async function resetPasswordEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password-confirm`,
  })

  if (error) throw error
}

/**
 * Atualiza a senha do usuário (usar após clicar no magic link)
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
}

/**
 * Cria um token de compartilhamento para uma lista
 */
export async function createShareToken(
  listaId: string,
  exigirLogin: boolean = false
) {
  const { data, error } = await supabase
    .from('lista_acesso_compartilhado')
    .insert([
      {
        lista_id: listaId,
        exigir_login: exigirLogin,
      },
    ])
    .select('token')
    .single()

  if (error) throw error
  return data.token
}

/**
 * Valida um token de compartilhamento
 */
export async function validateShareToken(token: string, listaId: string) {
  const { data, error } = await supabase
    .from('lista_acesso_compartilhado')
    .select('*')
    .eq('token', token)
    .eq('lista_id', listaId)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    throw new Error('Token inválido ou expirado')
  }

  // Verificar se expirou
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw new Error('Token expirado')
  }

  return data
}

/**
 * Gera a URL de compartilhamento
 */
export function getShareUrl(listaId: string, token: string): string {
  return `${window.location.origin}/#/comprador/${listaId}?token=${token}`
}
