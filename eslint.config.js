import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import sonarjs from "eslint-plugin-sonarjs";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  // Base + TS
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      unicorn,
      sonarjs,
      "simple-import-sort": simpleImportSort,
      perfectionist,
      prettier: prettierPlugin,
    },
    settings: {},
    rules: {
      // React
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],

      // TS strict-ish
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",

      // Import ordering
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Code quality (調整)
      ...unicorn.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,

      // Relax a few Unicorn rules for React projects
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-nested-ternary": "off",

      // Sorting within objects/arrays (stable, readable diffs)
      "perfectionist/sort-objects": ["error", { type: "natural" }],

      // Prettier as a rule + disable formatting conflicts
      "prettier/prettier": "error",

      // Practical relaxations
      "unicorn/no-null": "off",
      "unicorn/no-array-sort": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/prefer-ternary": "warn",
      "unicorn/consistent-function-scoping": "warn",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-commented-code": "off",
      "sonarjs/no-nested-conditional": "off",
      "sonarjs/no-all-duplicated-branches": "off",
      "sonarjs/no-invariant-returns": "off",
      "sonarjs/no-redundant-jump": "off",
      "sonarjs/no-globals-shadowing": "error",
      "sonarjs/pseudo-random": "error",
    },
  },
  // 注意: typescript-eslintのflat configでは文字列extendsは非対応のため、
  // eslint-config-prettierやprettier-pluginのconfigsはここに直接渡さない。
);
