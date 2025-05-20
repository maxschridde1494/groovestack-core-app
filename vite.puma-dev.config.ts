import fs from 'fs'
import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [
    react(),
    RubyPlugin(),
  ],
  server: {
    https: {
      key: fs.readFileSync('./vite.groovestack-core.test-key.pem'),
      cert: fs.readFileSync('./vite.groovestack-core.test.pem'),
    },
    hmr: {
      protocol: 'wss',
      host: 'vite.groovestack-core.test',
    },
  },
  build: {
    sourcemap: true,
  },
})