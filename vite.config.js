import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Mengoptimalkan build
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Menghapus console.log di production
        drop_debugger: true,
      },
    },
    // Mengatur chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          // Tambahkan library lain yang besar di sini
        },
        // Mengatur nama file output
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
  server: {
    port: 8080, // Menyesuaikan dengan port Cloud Run
    host: true, // Mengizinkan akses dari luar
  },
});
