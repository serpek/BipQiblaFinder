import { createLogger, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { visualizer } from 'rollup-plugin-visualizer'
import fs from 'fs'
import path from 'path'

const logger = createLogger()
logger.clearScreen('error')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
