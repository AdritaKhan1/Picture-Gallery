import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// proxy so the frontend can call the backend during development
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api':     { target: 'http://localhost:8080', changeOrigin: true },
      '/uploads': { target: 'http://localhost:8080', changeOrigin: true }
    }
  }
});
