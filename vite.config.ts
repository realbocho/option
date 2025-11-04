import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/history': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/bs_price': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/pnl': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
