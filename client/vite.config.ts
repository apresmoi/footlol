import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json';

const proxyTarget = process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8081';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(`${pkg.version}+${Date.now()}`),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        short_name: 'Footlol',
        name: 'Footlol — Multiplayer Football Arena',
        description:
          'A browser multiplayer football game with champion-inspired abilities and live team matches.',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: '/icon.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: '/icon.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'landscape',
        theme_color: '#0e1626',
        background_color: '#0e1626',
        categories: ['games', 'sports', 'entertainment'],
        lang: 'en',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2,otf}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /\/(api|ws)(\/|$)/,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
      '/ws': {
        target: proxyTarget,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
});
