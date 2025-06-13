# 宇部高専文化祭 2025 公式サイト

本サイトは React、TypeScript、Vite を使用して構築された宇部高専文化祭 2025 の公式ウェブサイトです。来場者の皆さまに、イベント情報、展示内容、スケジュール、会場マップなど、文化祭に関するあらゆる情報をわかりやすくお届けします。

## 主な機能

- **バイリンガル対応**：日本語／英語の切り替え機能
- **テーマ切替**：ライトモード／ダークモードに対応
- **モバイルファースト設計**：スマホからデスクトップまで快適に閲覧可能
- **インタラクティブ会場マップ**：SVG を使った会場図とスポットハイライト
- **動的イベントスケジュール**：日付ごとに絞り込めるタイムテーブル
- **展示＆屋台ギャラリー**：全出展の一覧表示と詳細閲覧
- **ブックマーク機能**：お気に入りのイベントや展示を保存
- **検索機能**：キーワードでイベントや展示を検索
- **タグフィルタ**：タグやカテゴリで絞り込み可能
- **GSAP アニメーション**：サイト全体のスムーズな演出

## 技術スタック

- **React v19**：最新機能と高いパフォーマンス
- **TypeScript**：型安全な開発をサポート
- **Vite**：高速なビルド／開発サーバー
- **React Router**：クライアントサイドルーティング
- **Context API**：グローバルな状態管理
- **GSAP**：高度なアニメーションライブラリ
- **TailwindCSS 3.4.4**：ユーティリティファーストCSSフレームワーク
- **PostCSS**：CSS変換ツール（TailwindCSS処理用）
- **CSS Variables**：テーマ変数によるカスタマイズ

## ディレクトリ構成

```
kosen-fes-2025/
├── public/               # 静的資産・画像
├── src/
│   ├── components/      # 再利用可能な UI コンポーネント
│   │   ├── bookmarks/    # ブックマーク関連
│   │   ├── common/       # 共通 UI 要素
│   │   ├── detail/       # 詳細ページ
│   │   ├── events/       # イベント一覧・詳細
│   │   ├── exhibits/     # 展示一覧・詳細
│   │   ├── home/         # ホームページ
│   │   ├── layout/       # ヘッダー／サイドバー／フッター
│   │   ├── map/          # 会場マップ
│   │   ├── schedule/     # スケジュール表示
│   │   └── search/       # 検索機能
│   ├── context/         # React Context 定義
│   ├── data/            # モックデータ（events／exhibits／stalls）
│   ├── pages/           # ページコンポーネント
│   ├── styles/          # CSSスタイル
│   │   ├── components/   # コンポーネント別スタイル
│   │   └── theme/        # テーマ変数／スタイル
│   ├── types/           # TypeScript 型定義
│   ├── utils/           # ヘルパー関数
│   ├── App.tsx          # メインアプリコンポーネント
│   ├── AppProviders.tsx # Context プロバイダー設定
│   └── main.tsx         # エントリーポイント
├── index.html           # HTML テンプレート
├── package.json         # 依存関係定義
├── tsconfig.json        # TypeScript 設定
└── vite.config.ts       # Vite 設定
```

### 主なコンポーネント・ファイル

- **AppProviders.tsx**：テーマ／言語／ブックマーク／検索／タグの各 Context をまとめて設定
- **context/**：
  - `ThemeContext.tsx`：テーマ切替を管理
  - `LanguageContext.tsx`：言語切替を管理
  - `BookmarkContext.tsx`：ブックマーク機能を管理
  - `SearchContext.tsx`：検索機能を管理
  - `TagContext.tsx`：タグフィルタを管理
- **data/**：
  - `events.ts`：イベント情報
  - `exhibits.ts`：展示情報
  - `stalls.ts`：屋台情報
- **pages/**：
  - `Home.tsx`：トップページ
  - `Events.tsx`：イベント一覧ページ
  - `Exhibits.tsx`：展示・屋台一覧ページ
  - `TimeSchedule.tsx`：タイムテーブルページ
  - `Map.tsx`：インタラクティブマップページ
  - `Detail.tsx`：詳細表示ページ
  - `Search.tsx`：検索結果ページ
  - `Bookmarks.tsx`：ブックマーク一覧ページ
- **components/common/**：Card、Tag、SearchBar などの汎用コンポーネント
- **utils/**：
  - `animations.ts`：GSAP 用アニメーション関数
  - `formatters.tsx`：日付・テキスト整形関数
  - `translations.ts`：翻訳文字列とヘルパー関数

## セットアップ

### 必要環境

- Node.js v16 以上
- npm または yarn

### インストール手順

1. リポジトリをクローン

   ```bash
   git clone https://github.com/rebuildup/kosen-fes-2025.git
   cd kosen-fes-2025
   ```

2. 依存パッケージをインストール

   ```bash
   npm install
   # または
   yarn
   ```

3. 開発用サーバー起動

   ```bash
   npm run dev
   # または
   yarn dev
   ```

4. 本番用ビルド

   ```bash
   npm run build
   # または
   yarn build
   ```

## コンテンツ追加方法

### イベント追加

`src/data/events.ts` を編集し、以下の形式でオブジェクトを追加してください。

```ts
{
  id: "event-7",            // ユニークID
  type: "event",
  title: "イベントタイトル",
  description: "詳細説明文",
  imageUrl: "/images/events/event-7.jpg",
  date: "2025-06-15",      // YYYY-MM-DD
  time: "14:00 - 15:30",    // HH:MM - HH:MM
  location: "Main Stage",
  tags: ["performance", "music"],
  organizer: "主催者名",
  duration: 90,               // 分
}
```

### 展示追加

`src/data/exhibits.ts` に以下の形式でオブジェクトを追加してください。

```ts
{
  id: "exhibit-7",
  type: "exhibit",
  title: "展示タイトル",
  description: "詳細説明文",
  imageUrl: "/images/exhibits/exhibit-7.jpg",
  date: "2025-06-15",
  time: "10:00 - 18:00",
  location: "Art Building, Gallery Hall",
  tags: ["art", "digital"],
  creator: "制作者名",
}
```

### 屋台追加

`src/data/stalls.ts` に以下の形式でオブジェクトを追加してください。

```ts
{
  id: "stall-7",
  type: "stall",
  title: "屋台タイトル",
  description: "詳細説明文",
  imageUrl: "/images/stalls/stall-7.jpg",
  date: "2025-06-15",
  time: "11:00 - 20:00",
  location: "Food Court Area, Stall 6",
  tags: ["food", "japanese"],
  products: ["Product 1", "Product 2"],
}
```

### 画像追加

1. 各ディレクトリにアップロード：
   - `/public/images/events/`
   - `/public/images/exhibits/`
   - `/public/images/stalls/`
2. ファイル名例：
   - `event-{番号}.jpg`
   - `exhibit-{番号}.jpg`
   - `stall-{番号}.jpg`
3. 推奨設定：
   - サイズ：800×450px（16:9）
   - 形式：JPG／WebP
   - ファイル容量：200KB 以下

### 会場マップ更新

`src/components/map/MapDisplay.tsx` 内の `locationCoordinates` に新規スポットを追加します。

```ts
const locationCoordinates: Record<string, { x: number; y: number }> = {
  // 既存のマッピング,
  新しいスポット名: { x: 45, y: 65 },
};
```

### 翻訳追加・修正

`src/utils/translations.ts` の `enTranslations`／`jaTranslations` に対応するキーを追加・編集し、両言語の整合性を保ってください。

## カスタマイズ

### スタイル調整

- **TailwindCSS**：メインのスタイリングはTailwindCSSユーティリティクラスを使用
  - 設定：`tailwind.config.js`
  - カスタムクラス：`src/index.css`の `@layer` ディレクティブで追加
- **CSS Variables**：テーマ変数は `src/styles/theme.css` で定義
- **グローバルスタイル**：`src/styles/global.css`（必要最小限に抑制）
- **コンポーネント**：個別のCSS filesは廃止し、TailwindCSSクラスを使用

### TailwindCSS使用方法

1. **基本的なユーティリティクラス**：
   ```tsx
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
     <h2 className="text-xl font-semibold text-slate-900">Title</h2>
   </div>
   ```

2. **レスポンシブ対応**：
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
   ```

3. **ダークモード対応**：
   ```tsx
   <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
   ```

4. **カスタムクラス追加**：`src/index.css` で `@layer` を使用
   ```css
   @layer components {
     .btn-primary {
       @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700;
     }
   }
   ```

- **ナビゲーション編集**：ルート定義は `src/routes.tsx` を更新

## サーバー設定

- 本番ビルド成果物を指定ディレクトリに配置
- ストレージ上限：2GB
- URL：`https://festival.ube-k.ac.jp/2025/`

## 対応ブラウザ

- Chrome／Edge（最新）
- Firefox（最新）
- Safari（最新）
- iOS／Android のモバイルブラウザ

## ライセンス

MIT ライセンス

## クレジット

宇部高専文化祭 2025 公式サイトとして作成
