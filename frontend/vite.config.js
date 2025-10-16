import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5100',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, ''), // Only if you need to strip /api
      },
    },
  },
});