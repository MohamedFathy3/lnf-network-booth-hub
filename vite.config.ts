/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const getEnv = (key: string, defaultValue: string): string =>
  process.env[key] || defaultValue;

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  const parsedValue = value ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isNaN(parsedValue) ? defaultValue : parsedValue;
};

const getPackageVersion = (): string => process.env.npm_package_version || "1.0.0";

export default defineConfig({
  tanstackStart: {
    nitro: {
      preset: "node-server",
    },
    // Redirect TanStack Start's bundled server entry to src/server.ts.
    server: { entry: "server" },
  },
  vite: {
    server: {
      host: "0.0.0.0",
      port: getEnvNumber("VITE_DEV_SERVER_PORT", 7000),
      strictPort: false,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: getEnv("VITE_API_TARGET", "https://apipay.wsa-elite.com/"),
          changeOrigin: true,
          secure: false,
          rewrite: (path) =>
            path.replace(/^\/api/, getEnv("VITE_API_REWRITE_PATH", "/api")),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              if (process.env.NODE_ENV === "development") {
                console.log("Sending Request:", req.method, req.url);
              }
              proxyReq.setHeader(
                getEnv("VITE_API_HEADER_NAME", "X-Requested-With"),
                getEnv("VITE_API_HEADER_VALUE", "XMLHttpRequest"),
              );
            });
            proxy.on("proxyRes", (proxyRes, req) => {
              if (process.env.NODE_ENV === "development") {
                console.log("Response Status:", proxyRes.statusCode, req.url);
              }
            });
          },
        },
        "/sanctum": {
          target: getEnv("VITE_SANCTUM_TARGET", "https://apipay.wsa-elite.com/"),
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              if (process.env.NODE_ENV === "development") {
                console.log("Sanctum Request:", req.method, req.url);
              }
            });
          },
        },
      },
    },
    preview: {
      host: "0.0.0.0",
      port: getEnvNumber("VITE_PREVIEW_SERVER_PORT", 7002),
      strictPort: false,
      allowedHosts: true,
    },
    css: {
      modules: {
        localsConvention: "camelCase",
      },
    },
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          chunkFileNames: "chunks/[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
    },
    define: {
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(getPackageVersion()),
      "import.meta.env.VITE_BUILD_TIME": JSON.stringify(new Date().toISOString()),
    },
  },
});
