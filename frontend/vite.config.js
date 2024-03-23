import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    replace({
      'import.meta.env': JSON.stringify({
        VITE_API_URL: process.env.VITE_API_URL
      }),
    }),
  ],
})
