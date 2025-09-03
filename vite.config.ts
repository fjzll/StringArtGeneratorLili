/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Prerendering configuration for SEO optimization
    vitePrerenderPlugin({
      renderTarget: '#root',
      prerenderScript: './src/prerender.ts'
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
  // Build optimizations for prerendering and performance
  build: {
    // Enable source maps for better debugging
    sourcemap: true,
    // Target modern browsers for better performance
    target: 'esnext',
    // Optimize chunk size thresholds
    chunkSizeWarningLimit: 1000,
    // CSS code splitting
    cssCodeSplit: true,
    // Minification (using esbuild for performance)
    minify: 'esbuild',
    // Optimize chunks for better loading and caching
    rollupOptions: {
      output: {
        // Advanced code splitting strategy
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            // UI library
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor'
            }
            // Other vendor libraries
            if (id.includes('framer-motion')) {
              return 'animation-vendor'
            }
            return 'vendor'
          }
          
          // App-specific chunks
          if (id.includes('src/lib/algorithms')) {
            return 'algorithms' // Lazy load heavy string art algorithms
          }
          if (id.includes('src/components/content')) {
            return 'content' // Lazy load content components
          }
          if (id.includes('src/components/ui')) {
            return 'ui-components'
          }
        },
        // Optimize asset naming for better caching
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] || 'asset'
          const info = fileName.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      },
      // External dependencies (if needed for CDN optimization)
      external: [],
      // Plugin optimizations
      plugins: []
    }
  },
  
  // Enhanced preview server configuration
  preview: {
    port: 4173,
    strictPort: true,
    // Enable compression
    headers: {
      'Cache-Control': 'public, max-age=31536000', // 1 year cache for assets
    }
  },
  
  // Performance optimizations
  optimizeDeps: {
    // Include dependencies that should be pre-bundled
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-accordion',
      '@radix-ui/react-progress',
      '@radix-ui/react-slider'
    ],
    // Exclude large dependencies from pre-bundling
    exclude: ['./src/lib/algorithms/stringArtEngine']
  }
})
