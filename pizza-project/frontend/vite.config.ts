import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'public/images', dest: '' } // Copia a pasta images para dist
      ]
    })
  ],
  base: './',
  build: {
    outDir: 'dist'
  }
});
