import { defineConfig } from 'vite'
export default defineConfig({
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
  