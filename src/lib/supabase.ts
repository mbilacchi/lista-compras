import { createClient } from '@supabase/supabase-js'

// Tenta carregar de import.meta.env (build-time)
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Fallback para valores hardcoded se não carregou do build
// (Estes são valores públicos - chave de API pública)
if (!supabaseUrl) {
  supabaseUrl = 'https://cjhofwejlgpkgsseoqjj.supabase.co'
  console.warn('⚠️ Using hardcoded Supabase URL')
}
if (!supabaseAnonKey) {
  supabaseAnonKey = 'sb_publishable_1IIMSjxySlOGmGR-OZMhsw_3GSYfscq'
  console.warn('⚠️ Using hardcoded Supabase Anon Key')
}

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('ERROR: Supabase env vars were not set. Using fallback hardcoded values.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
