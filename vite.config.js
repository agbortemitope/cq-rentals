import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
});
