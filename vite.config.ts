import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    target: "esnext", // ou ajuste para o alvo de ES que você precisa
    rollupOptions: {
      output: {
        format: "system", // Saída no formato SystemJS
        entryFileNames: "main.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      // @ts-ignore
      "@": path.resolve(__dirname, "src"),
    },
  },
});
