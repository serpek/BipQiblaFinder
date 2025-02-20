import { createLogger, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { visualizer } from 'rollup-plugin-visualizer'

const logger = createLogger()
logger.clearScreen('error')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
    // visualizer({ open: true, filename: 'bundle-visualization.html' })
  ],
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
