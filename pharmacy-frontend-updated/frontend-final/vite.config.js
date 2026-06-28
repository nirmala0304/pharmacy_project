import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // FIX: Changed base from './' to '/' for proper SPA routing.
  // base: './' generates relative asset URLs which breaks direct
  // URL navigation and page refreshes with react-router-dom.
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      // FIX: Added WebSocket proxy so /ws/* connections are forwarded
      // to the Spring Boot backend in development mode.
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
