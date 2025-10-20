import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    assetsDir: "assets",
    // バンドルサイズの最適化
    rollupOptions: {
      output: {
        manualChunks: {
          // React関連を分離
          react: ["react", "react-dom", "react-router-dom"],
          // アニメーション関連を分離
          animation: ["gsap"],
          // 日付処理を分離
          utils: ["date-fns"],
          // UI関連を分離
          ui: ["lucide-react"],
        },
      },
    },
    // チャンクサイズの警告を無効化（手動で制御しているため）
    chunkSizeWarningLimit: 1000,
    // ソースマップを本番では無効化
    sourcemap: false,
    // 圧縮設定
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2, // 追加の圧縮パス
      },
      mangle: {
        safari10: true, // Safari 10対応
      },
      format: {
        comments: false, // コメントを削除
      },
    },
    // より積極的な最適化
    target: "es2015", // より新しいブラウザをターゲット
    cssCodeSplit: true, // CSSを分割
    reportCompressedSize: false, // 圧縮サイズレポートを無効化（ビルド速度向上）
  },
  plugins: [react(), tailwindcss()],
  // 画像の最適化
  assetsInclude: ["**/*.webp", "**/*.jpg", "**/*.jpeg", "**/*.png"],
  // 開発サーバーの最適化
  server: {
    // ホットリロードの最適化
    hmr: {
      overlay: false,
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
});
