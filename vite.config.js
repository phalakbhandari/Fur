import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 3000,
    open: true,
  },

  build: {
    // Surfaces a regression in the split before it reaches a user.
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React changes far less often than the app does; keeping it in its
          // own chunk means a deploy does not invalidate it in every cache.
          react: ['react', 'react-dom'],
          motion: ['motion'],
        },
      },
    },
  },
});
