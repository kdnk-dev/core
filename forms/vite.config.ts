import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ rollupTypes: true, tsconfigPath: "./tsconfig.json" }),
    viteStaticCopy({
      targets: [
        {
          src: "../tailwind.default.theme.css",
          dest: ".",
          rename: "kdnk-default-theme.css",
        },
        {
          src: "dist/style.css",
          dest: ".",
          rename: "form-style.css",
        },
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer({})],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: [
        resolve(__dirname, "./src/index.ts"),
        resolve(__dirname, "./src/server.ts"),
      ],
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "React-dom",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
  },
});
