import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase init:')
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✓ loaded' : '✗ missing')
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ loaded' : '✗ missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'ERRO CRÍTICO: Variáveis do Supabase ausentes. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente do Netlify.'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
