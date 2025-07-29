# 宇部高専文化祭 2025 公式サイト

本サイトは React、TypeScript、Vite を使用して構築された宇部高専文化祭 2025 の公式ウェブサイトです。来場者の皆さまに、イベント情報、展示内容、スケジュール、会場マップなど、文化祭に関するあらゆる情報をわかりやすくお届けします。

## 主な機能

- バイリンガル対応（日本語／英語の切り替え機能）
- テーマ切替（ライトモード／ダークモードに対応）
- モバイルファースト設計（スマホからデスクトップまで快適に閲覧可能）
- インタラクティブ会場マップ（SVG を使った会場図とスポットハイライト）
- 動的イベントスケジュール（日付ごとに絞り込めるタイムテーブル）
- 展示＆屋台ギャラリー（全出展の一覧表示と詳細閲覧）
- ブックマーク機能（お気に入りのイベントや展示を保存）
- 検索機能（キーワードでイベントや展示を検索）
- タグフィルタ（タグやカテゴリで絞り込み可能）
- GSAP アニメーション（サイト全体のスムーズな演出）

## 技術スタック

- React v18.2.0（最新機能と高いパフォーマンス）
- TypeScript（型安全な開発をサポート）
- Vite（高速なビルド／開発サーバー）
- React Router（クライアントサイドルーティング）
- Context API（グローバルな状態管理）
- GSAP（高度なアニメーションライブラリ）
- TailwindCSS 4.1.10（ユーティリティファースト CSS フレームワーク）
- PostCSS（CSS 変換ツール（TailwindCSS 処理用））
- CSS Variables（テーマ変数によるカスタマイズ）

## ディレクトリ構成

```
kosen-fes-2025/
├── public/               # 静的資産・画像
├── src/
│   ├── app/             # アプリケーション設定
│   │   ├── config/       # アプリ設定
│   │   ├── providers/    # プロバイダー設定
│   │   └── router/       # ルーティング設定
│   ├── assets/          # アセット（アイコン等）
│   ├── components/      # 再利用可能な UI コンポーネント
│   │   ├── bookmarks/    # ブックマーク関連
│   │   ├── common/       # 共通 UI 要素
│   │   ├── detail/       # 詳細ページ
│   │   ├── events/       # イベント一覧・詳細
│   │   ├── exhibits/     # 展示一覧・詳細
│   │   ├── home/         # ホームページ
│   │   ├── icons/        # アイコンコンポーネント
│   │   ├── layout/       # ヘッダー／サイドバー／フッター
│   │   ├── map/          # 会場マップ
│   │   ├── schedule/     # スケジュール表示
│   │   └── search/       # 検索機能
│   ├── context/         # React Context 定義
│   ├── data/            # データ管理
│   │   ├── buildings.ts   # 建物データ
│   │   ├── dataManager.ts # データ管理システム
│   │   ├── events.ts      # イベント情報
│   │   ├── exhibits.ts    # 展示情報
│   │   ├── locationCoordinates.ts # 座標データ
│   │   ├── sponsors.ts    # スポンサー情報
│   │   ├── stalls.ts      # 屋台情報
│   │   └── store.ts       # データストア
│   ├── hooks/           # カスタムフック
│   ├── pages/           # ページコンポーネント
│   ├── shared/          # 共有コンポーネント・ユーティリティ
│   │   ├── components/   # 共有UIコンポーネント
│   │   ├── constants/    # 定数定義
│   │   ├── hooks/        # 共有フック
│   │   ├── types/        # 共有型定義
│   │   └── utils/        # 共有ユーティリティ
│   ├── types/           # TypeScript 型定義
│   ├── utils/           # ヘルパー関数
│   ├── App.tsx          # メインアプリコンポーネント
│   ├── AppProviders.tsx # Context プロバイダー設定
│   ├── index.css        # グローバルスタイル
│   ├── main.tsx         # エントリーポイント
│   └── routes.tsx       # ルーティング設定
├── index.html           # HTML テンプレート
├── package.json         # 依存関係定義
├── tsconfig.json        # TypeScript 設定
└── vite.config.ts       # Vite 設定
```

### 主なコンポーネント・ファイル

以下は、主要なコンポーネントとファイルの構成です。

- **AppProviders.tsx** - テーマ／言語／ブックマーク／検索／タグの各 Context をまとめて設定
- **context/フォルダ** - 以下の Context 管理ファイルを格納
  - `ThemeContext.tsx` - テーマ切替を管理
  - `LanguageContext.tsx` - 言語切替を管理
  - `BookmarkContext.tsx` - ブックマーク機能を管理
  - `SearchContext.tsx` - 検索機能を管理
  - `TagContext.tsx` - タグフィルタを管理
- **data/フォルダ** - データファイルの格納場所
  - `events.ts` - イベント情報
  - `exhibits.ts` - 展示情報
  - `stalls.ts` - 屋台情報
  - `sponsors.ts` - スポンサー情報
  - `buildings.ts` - 建物データ
  - `locationCoordinates.ts` - 座標データ
  - `dataManager.ts` - データ管理システム
- **pages/フォルダ** - ページコンポーネント
  - `Home.tsx` - トップページ
  - `Events.tsx` - イベント一覧ページ
  - `Exhibits.tsx` - 展示・屋台一覧ページ
  - `Sponsors.tsx` - スポンサー一覧ページ
  - `TimeSchedule.tsx` - タイムテーブルページ
  - `Map.tsx` - インタラクティブマップページ
  - `Detail.tsx` - 詳細表示ページ
  - `Search.tsx` - 検索結果ページ
  - `Bookmarks.tsx` - ブックマーク一覧ページ
  - `ContentPreview.tsx` - コンテンツプレビューページ
  - `Error.tsx` - エラーページ
  - `NotFound.tsx` - 404 ページ
- **components/common/フォルダ** - Card、Tag、SearchBar などの汎用コンポーネント
- **utils/フォルダ** - ユーティリティファイル
  - `animations.ts` - GSAP 用アニメーション関数
  - `formatters.tsx` - 日付・テキスト整形関数
  - `translations.ts` - 翻訳文字列とヘルパー関数

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
  imageUrl: "./images/events/event-7.jpg",
  date: "2025-11-08",      // YYYY-MM-DD
  time: "14:00 - 15:30",    // HH:MM - HH:MM
  location: "Main Stage",
  coordinates: { x: 326.4, y: 1039.7 }, // マップ座標
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
  imageUrl: "./images/exhibits/exhibit-7.jpg",
  date: "2025-11-08",
  time: "10:00 - 18:00",
  location: "Art Building, Gallery Hall",
  coordinates: { x: 790.2, y: 948.5 }, // マップ座標
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
  imageUrl: "./images/stalls/stall-7.jpg",
  date: "2025-11-08",
  time: "11:00 - 20:00",
  location: "Food Court Area, Stall 6",
  coordinates: { x: 88.0, y: 968.5 }, // マップ座標
  tags: ["food", "japanese"],
  organizer: "運営者名",
  products: ["商品1", "商品2"],
}
```

### スポンサー追加

`src/data/sponsors.ts` に以下の形式でオブジェクトを追加してください。

```ts
{
  id: "sponsor-10",
  type: "sponsor",
  title: "スポンサー名",
  description: "詳細説明文",
  imageUrl: "./images/sponsors/sponsor-10.jpg",
  date: "2025-11-08",
  time: "10:00 - 18:00",
  location: "メインホール",
  tags: ["スポンサー", "技術"],
  website: "https://example.com/",
  contactEmail: "contact@example.com", // オプション
}
```

### 画像追加

画像ファイルの追加手順は以下の通りです。

1. 各ディレクトリへアップロード
   - `/public/images/events/`
   - `/public/images/exhibits/`
   - `/public/images/stalls/`
   - `/public/images/sponsors/`
2. ファイル名の例
   - `event-{番号}.jpg`
   - `exhibit-{番号}.jpg`
   - `stall-{番号}.jpg`
   - `sponsor-{番号}.jpg`
3. 推奨設定
   - サイズ：800×450px（16:9）
   - 形式：JPG／WebP
   - ファイル容量：200KB 以下

### 会場マップ更新

`src/data/locationCoordinates.ts` 内の `locationCoordinates` に新規スポットを追加します。

```ts
export const locationCoordinates: Record<string, LocationCoordinate> = {
  // 既存のマッピング,
  新しいスポット名: {
    id: "new-location",
    name: "新しいスポット名",
    coordinates: { x: 45, y: 65 },
    type: "landmark",
    category: "general",
  },
};
```

### 翻訳追加・修正

`src/utils/translations.ts` の `enTranslations`／`jaTranslations` に対応するキーを追加・編集し、両言語の整合性を保ってください。

## カスタマイズ

### スタイル調整（TailwindCSS 完全移行済み）

**📌 重要**: このプロジェクトは TailwindCSS 4.1.10 を使用しており、すべてのスタイリングが TailwindCSS で行われています。

- **TailwindCSS 4.1.10**：すべてのスタイリングを担当
  - 設定：Vite プラグインとして統合（`@tailwindcss/vite`）
  - メイン CSS：`src/index.css`（TailwindCSS ディレクティブとカスタムコンポーネント）
- **CSS Variables**：テーマ変数は `src/index.css` で定義
- **グローバルスタイル**：`src/index.css` で一元管理

### TailwindCSS 使用方法

1. **基本的なユーティリティクラス**：

   ```tsx
   <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
     <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
       Title
     </h2>
   </div>
   ```

2. **レスポンシブ対応**：

   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6 lg:px-8">
   ```

3. **ダークモード対応**：

   ```tsx
   <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
   ```

4. **カスタムコンポーネントクラス**：`src/index.css` の `@layer components` で定義済み

   ```css
   @layer components {
     .btn {
       @apply inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200;
     }
     .btn-primary {
       @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md;
     }
     .card {
       @apply bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200;
     }
   }
   ```

5. **固定レイアウト例**（ヘッダー・サイドバー・メインコンテンツ）：

   ```tsx
   {/* ヘッダー */}
   <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-[1000]">

   {/* サイドバー */}
   <aside className="w-64 fixed top-16 left-0 h-[calc(100vh-64px)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">

   {/* メインコンテンツ */}
   <main className="ml-64 pt-16 min-h-screen p-4">
   ```

### TailwindCSS カスタム設定

`src/index.css` で定義されているカスタム設定は以下の通りです。

- カスタムカラー（primary, secondary, accent で各 50-950 シェード）
- カスタムフォント（Inter（sans）、JetBrains Mono（mono））
- カスタムスペーシング（18, 88, 112, 128）
- カスタムアニメーション（fade-in, slide-in, bounce-soft, pulse-soft）
- プラグイン（@tailwindcss/typography, @tailwindcss/forms, @tailwindcss/aspect-ratio）

ナビゲーション編集については、ルート定義は `src/routes.tsx` を更新してください。

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

### ソフトウェア部分（MIT ライセンス）

このプロジェクトのソフトウェア部分（ソースコード、設定ファイル、ドキュメント）は MIT ライセンスの下で公開されています。

```
MIT License

Copyright (c) 2025 Ube National College of Technology

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### コンテンツ部分（All Rights Reserved）

以下のコンテンツは宇部高等専門学校の著作権により保護されており、許可なく使用することはできません：

- **画像ファイル**：`public/images/` ディレクトリ内のすべての画像
- **コンテンツデータ**：`src/data/` ディレクトリ内の以下のファイル
  - `events.ts` - イベント情報
  - `exhibits.ts` - 展示情報
  - `stalls.ts` - 屋台情報
  - `sponsors.ts` - スポンサー情報
  - `buildings.ts` - 建物データ
  - `locationCoordinates.ts` - 座標データ

これらのコンテンツを使用する場合は、宇部高等専門学校の事前許可が必要です。

## クレジット

宇部高専文化祭 2025 公式サイトとして作成
