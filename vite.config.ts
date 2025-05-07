import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [
    // react(),
    RubyPlugin(),
  ],
  server: {
    host: true,
  },
  build: {
    sourcemap: true,
  },
})


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import RubyPlugin from 'vite-plugin-ruby'

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   plugins: [react(), RubyPlugin()],
//   server: {
//     host: true,
//   },
//   build: {
//     sourcemap: mode === "development",
//   },
//   base: "./",
// }));