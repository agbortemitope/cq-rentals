import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  base: '/',
  plugins: [],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
});
