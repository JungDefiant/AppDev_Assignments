import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5173,
    // Forward API calls to the backend so the browser sees a single origin
    // (no CORS headaches during development).
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
