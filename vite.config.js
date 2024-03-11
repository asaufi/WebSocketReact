import { defineConfig } from 'vite'
export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist'
  },
    server: {
      proxy: {
        // Proxying websockets
        '/socket': {
            changeOrigin: true,
            secure: false,    
            target: 'ws://localhost:1234',
            ws: true,
        },
      },
    },
  })
  