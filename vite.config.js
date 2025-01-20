import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    // port: 3001, 

    host: '0.0.0.0',
    port: 3002,     
    strictPort: true, 
  },
})