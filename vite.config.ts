import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // 画像の最適化
  assetsInclude: ["**/*.webp", "**/*.jpg", "**/*.jpeg", "**/*.png"],
  base: "./",
  build: {
    assetsDir: "assets",
    // チャンクサイズの警告を無効化（手動で制御しているため）
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true, // CSSを分割
    // 圧縮設定
    minify: "terser",
    reportCompressedSize: false, // 圧縮サイズレポートを無効化（ビルド速度向上）
    // バンドルサイズの最適化
    rollupOptions: {
      output: {
        manualChunks: {
          // アニメーション関連を分離
          animation: ["gsap"],
          // React関連を分離
          react: ["react", "react-dom", "react-router-dom"],
          // UI関連を分離
          ui: ["lucide-react"],
          // 日付処理を分離
          utils: ["date-fns"],
        },
      },
    },
    // ソースマップを本番では無効化
    sourcemap: false,
    // より積極的な最適化
    target: "es2015", // より新しいブラウザをターゲット
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2, // 追加の圧縮パス
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
      format: {
        comments: false, // コメントを削除
      },
      mangle: {
        safari10: true, // Safari 10対応
      },
    },
  },
  // 依存関係の最適化
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "date-fns",
      "lucide-react",
    ],
  },
  plugins: [react(), tailwindcss()],
  // 開発サーバーの最適化
  server: {
    // ホットリロードの最適化
    hmr: {
      overlay: false,
    },
  },
});
