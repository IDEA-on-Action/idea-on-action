import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "logo-full.png", "logo-symbol.png"],
      manifest: {
        name: "VIBE WORKING - AI 기반 워킹 솔루션",
        short_name: "VIBE WORKING",
        description: "KEEP AWAKE, LIVE PASSIONATE - AI 기반 스마트 워크 플랫폼",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        categories: ["productivity", "business"],
        lang: "ko-KR",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1년
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1년
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/zykjdneewbzyazfukzyg\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5분
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // 개발 중에는 비활성화
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - React ecosystem (including React Query)
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/@tanstack/react-query')
          ) {
            return 'vendor-react';
          }

          // Vendor chunks - Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }

          // Vendor chunks - Radix UI (shadcn/ui base)
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui';
          }

          // Vendor chunks - React Router
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }

          // Vendor chunks - Charts (Recharts)
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }

          // Vendor chunks - Markdown (react-markdown, remark, rehype)
          if (
            id.includes('node_modules/react-markdown') ||
            id.includes('node_modules/remark') ||
            id.includes('node_modules/rehype')
          ) {
            return 'vendor-markdown';
          }

          // Vendor chunks - Forms (react-hook-form, zod)
          if (
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/zod') ||
            id.includes('node_modules/@hookform')
          ) {
            return 'vendor-forms';
          }

          // Vendor chunks - Payment SDKs
          if (id.includes('node_modules/@tosspayments')) {
            return 'vendor-payments';
          }

          // Vendor chunks - Auth & Security (otpauth, qrcode)
          if (
            id.includes('node_modules/otpauth') ||
            id.includes('node_modules/qrcode')
          ) {
            return 'vendor-auth';
          }

          // Vendor chunks - Sentry (에러 추적)
          if (id.includes('node_modules/@sentry')) {
            return 'vendor-sentry';
          }

          // Admin pages chunk
          if (id.includes('/src/pages/admin/')) {
            return 'pages-admin';
          }

          // Blog & CMS chunk
          if (
            id.includes('/src/pages/Blog') ||
            id.includes('/src/pages/Notices') ||
            id.includes('/src/components/blog/') ||
            id.includes('/src/components/notices/')
          ) {
            return 'pages-cms';
          }

          // E-commerce chunk
          if (
            id.includes('/src/pages/Checkout') ||
            id.includes('/src/pages/Payment') ||
            id.includes('/src/pages/Orders') ||
            id.includes('/src/components/cart/')
          ) {
            return 'pages-ecommerce';
          }

          // Services chunk
          if (
            id.includes('/src/pages/Services') ||
            id.includes('/src/pages/ServiceDetail')
          ) {
            return 'pages-services';
          }
        },
      },
    },
    // Set chunk size warning limit to 500 kB
    chunkSizeWarningLimit: 500,
  },
}));
