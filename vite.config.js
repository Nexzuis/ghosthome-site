import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://api:3000', // docker-compose service name
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
