import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'ERROR: Supabase env vars not loaded. Check .env.production or Netlify environment variables.'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
