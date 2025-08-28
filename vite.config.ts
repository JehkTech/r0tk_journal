import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      './styles/globals.css': path.resolve(__dirname, './src/styles/globals.css')
    }
  },
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  },
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3003
  }
});