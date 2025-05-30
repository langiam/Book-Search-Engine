import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // include .js (with JSX), .jsx, .tsx files:
      include: [
        'src/**/*.jsx',
        'src/**/*.js',
        'src/**/*.tsx',
      ]
    })
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
