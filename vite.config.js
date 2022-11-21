import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/rdf-entity.js',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit-element/
    }
  }
})
