import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwinds from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwinds()],
})
