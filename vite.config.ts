import { createLogger, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cleanPlugin from 'vite-plugin-clean'

import fs from 'fs'
import path from 'path'

import { execSync } from 'child_process'
// eslint-disable-next-line import/no-restricted-paths
import _package from './package.json'

// import { visualizer } from 'rollup-plugin-visualizer'

const logger = createLogger()
logger.clearScreen('error')

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
const version = `${_package.version}-${commitHash}`

// https://vite.dev/config/
export default defineConfig({
  base: '/app/kible/',
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(version)
  },
  plugins: [
    cleanPlugin(),
    react()
    // visualizer({ open: true, filename: 'bundle-visualization.html' })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl-cert/vite.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl-cert/vite.crt'))
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    outDir: 'dist/app/kible',
    assetsDir: '',
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        assetFileNames: ({ name }) => {
          if (/\.(css)$/.test(name ?? '')) {
            return 'css/[name]-[hash][extname]' // CSS dosyaları
          }

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/.test(name ?? '')) {
            return 'img/[name]-[hash][extname]' // Görseller
          }

          return 'assets/[name]-[hash][extname]' // Diğer dosyalar
        }
      }
    }
  }
})
