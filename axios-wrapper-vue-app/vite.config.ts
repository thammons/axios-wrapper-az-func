import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const baseConfig = {
    plugins: [vue()],
    resolve: {
      alias: [
        {
          find: "@",
          replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
      ],
    },

    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:7071",
          changeOrigin: true,
          secure: false,
          ws: true, //Proxy Web Sockets
          // onProxyReq: function(request: any) {
          //   request.setHeader("origin", "http://localhost:3000/");
          // },
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };

  return baseConfig;
});
