import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate", // 자동 업데이트 설정
      devOptions: { enabled: true }, // vite dev 로 돌려도 PWA 까지 볼 수 있게끔 주는 옵션

      manifest: {
        name: "Marineye",
        short_name: "Marineye",
        description: "A React app with Vite and PWA",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        start_url: "/",
        display: "standalone", // 앱처럼 보이게
        icons: [
          {
            src: "./icons/android-icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "./icons/android-icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "./icons/android-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "./icons/android-icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
