import { createLogger, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cleanPlugin from 'vite-plugin-clean'

// import { visualizer } from 'rollup-plugin-visualizer'

const logger = createLogger()
logger.clearScreen('error')

// https://vite.dev/config/
export default defineConfig({
  base: '/app/kible/',
  plugins: [
    cleanPlugin(),
    react()
    // visualizer({ open: true, filename: 'bundle-visualization.html' })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'ssl-cert/vite.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'ssl-cert/vite.crt'))
    // }
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
