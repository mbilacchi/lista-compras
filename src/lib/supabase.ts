import { createClient } from '@supabase/supabase-js'

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase initialization check:')
console.log('VITE_SUPABASE_URL from env:', supabaseUrl ? 'defined' : 'undefined')
console.log('VITE_SUPABASE_ANON_KEY from env:', supabaseAnonKey ? 'defined' : 'undefined')

// Fallback values for testing (these are public anon keys, not secret)
// Remove this after debugging - use Netlify env vars in production
if (!supabaseUrl) {
  supabaseUrl = 'https://cjhofwejlgpkgsseoqjj.supabase.co'
  console.warn('⚠️ Using fallback SUPABASE_URL')
}
if (!supabaseAnonKey) {
  supabaseAnonKey = 'sb_publishable_1IIMSjxySlOGmGR-OZMhsw_3GSYfscq'
  console.warn('⚠️ Using fallback SUPABASE_ANON_KEY')
}

console.log('✓ Supabase client initialized with:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
