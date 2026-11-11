import { defineConfig } from 'vite'
import react from '@tailwindcss/vite' // (veya @vitejs/plugin-react)
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      'brink-action-fable.ngrok-free.dev', // Şu an aldığın ngrok adresi
      '.ngrok-free.app',                   // Gelecekte alacağın ngrok adresleri için
      '.ngrok-free.dev'                    // Bu uzantıdaki tüm adresler için
    ]
  }
})