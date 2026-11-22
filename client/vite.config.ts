import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /api calls go to the Node server during development.
export default defineConfig({
  plugins: [react()],
  server: { port: 5180, proxy: { '/api': 'http://localhost:4000' } },
});
