import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Carrega variáveis de .env.production em modo production
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Injeta variáveis de ambiente no bundle
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
      ),
    },
  }
})
