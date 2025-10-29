# Kosen Fes 2025 — 公式サイト（開発者向け）

このリポジトリは宇部高専祭 2025 の公式ウェブサイトのフロントエンドです。
React + TypeScript + Vite を使って構築されています。開発者向けにセットアップ手順、主要なスクリプト、ディレクトリ構成、コンテンツ追加方法をまとめています。

## 目次
- 概要
- 必要な環境
- 主要スクリプト
- ローカル開発 / ビルド手順
- 主要なディレクトリとファイル
- コンテンツ（データ）追加方法
- カスタマイズ（スタイル / アニメーション）
- ライセンス

## 概要
- フロントエンド: React (v18) + TypeScript
- ビルドツール: Vite
- スタイリング: Tailwind CSS
- アニメーション: GSAP
- ルーティング: react-router-dom
- コード品質: Biome（リンター・フォーマッター）
- パッケージマネージャー: pnpm

## 必要な環境
- Node.js 16 以上
- pnpm（推奨）または npm

（推奨: Node.js のバージョン管理には nvm / asdf などを利用してください）

## 主要スクリプト（package.json）
- `pnpm run dev` — 開発サーバを起動（Vite）
- `pnpm run build` — 本番ビルド（TypeScript コンパイル + Vite ビルド + サイトマップ生成）
- `pnpm run build:static` — 静的サイト生成（ビルド + 全ルートのHTML生成）
- `pnpm run preview` — ビルド成果のローカルプレビュー（Vite preview）
- `pnpm run typecheck` — TypeScript の型チェック（tsc）
- `pnpm run test` — ユニットテスト（Vitest）
- `pnpm run lint` — Biome による静的チェック（リンター）
- `pnpm run lint:fix` — Biome による自動修正
- `pnpm run format` — Biome によるコードフォーマット

## ローカルでのセットアップと実行
1. リポジトリをクローン

```bash
git clone https://github.com/rebuildup/kosen-fes-2025.git
cd kosen-fes-2025
```

2. 依存インストール

```bash
pnpm install
# または
npm install
```

3. 開発サーバ起動

```bash
pnpm run dev
# ブラウザで http://localhost:5173 を開く
```

4. 本番用ビルド（確認）

```bash
# 通常のビルド（サイトマップ生成まで）
pnpm run build
pnpm run preview

# 静的サイト生成（全ルートのHTML生成）
pnpm run build:static
pnpm run preview
```

5. 型チェック

```bash
pnpm run typecheck
```

6. テスト

```bash
pnpm run test
```

7. コード品質チェック

```bash
pnpm run lint      # リンター実行
pnpm run lint:fix  # 自動修正
pnpm run format    # フォーマット
```

---

## 主要なディレクトリ / ファイル
- `public/` — 静的資産（画像、manifest、service worker）
- `src/`
  - `app/` — アプリ設定、プロバイダー、ルーター
  - `components/` — 再利用可能コンポーネント（カード、タグ、レイアウト等）
  - `pages/` — ページコンポーネント（Home, Events, Exhibits, TimeSchedule 等）
  - `data/` — イベント・展示・屋台・スポンサー等の JSON/TS データ
  - `context/` — React Context（言語、テーマ、タグ、ブックマーク等）
  - `utils/` — ユーティリティ関数（フォーマット、アニメーション等）
  - `index.css` — Tailwind とカスタム CSS（アニメーションクラス等）
  - `main.tsx` — エントリーポイント

## SEO / 静的サイト生成
- `scripts/generate-static.js` — 静的ファイル（HTML）の生成スクリプト
- `scripts/generate-sitemap.js` — サイトマップ生成

## コンテンツ（データ）追加方法
コンテンツは `src/data/` にある各ファイルを編集して追加します。編集後は開発サーバで即時反映されます（Vite のホットリロード）。

- イベント: `src/data/events.json`（または TypeScript の型ファイル）
- 展示: `src/data/exhibits.json`
- 屋台: `src/data/stalls.json`
- スポンサー: `src/data/sponsors.json`

データの形式は既存ファイルを参考にしてください。各アイテムは少なくとも `id`, `type`, `title` を持つ必要があります。画像を追加する場合は `public/images/` または `public/assets/` に配置し、`imageUrl` に相対パスを指定します。

### イベント追加の簡単な例（src/data/events.json）
```json
{
  "id": "event-7",
  "type": "event",
  "title": "イベントタイトル",
  "description": "詳細説明",
  "date": "2025-11-08",
  "time": "14:00 - 15:30",
  "location": "Main Stage",
  "tags": ["performance", "music"]
}
```

## カスタマイズ（スタイル / アニメーション）
- Tailwind の設定やカスタム CSS は `src/index.css` にまとまっています。
- アニメーションユーティリティは `src/utils/animations.ts` にあります（GSAP を用いた関数／定数を定義）。
- カードの入場アニメーションは CSS クラス（`.animate-card-enter` / `.animate-card-enter-list` / `.animate-category-change`）で制御されています。

## 開発時の注意点 / デバッグ
- カード表示方式の切替やタグフィルタによるリスト更新時にアニメーションを発火させるため、`CardGrid` は内部で `animationKey` を更新して要素の key を変化させています。
- スケジュール（Timeline）ページはカードのアニメーションをリスト表示と合わせるように調整済みです。

## コード品質管理
- **Biome**: リンター・フォーマッターとして使用
  - `pnpm run lint` でコード品質チェック
  - `pnpm run lint:fix` で自動修正
  - `pnpm run format` でコードフォーマット
- **TypeScript**: 型チェック（`pnpm run typecheck`）
- **Vitest**: ユニットテスト（`pnpm run test`）

## ライセンス
このリポジトリのソースコードは MIT ライセンスの下で配布されています（LICENSE を参照）。

※ 画像や学校提供資料などのコンテンツは各権利者に帰属します。無断利用は避けてください。