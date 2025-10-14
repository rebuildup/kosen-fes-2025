/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // システム設定またはローカルストレージからテーマを初期化
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }

    // システム設定を確認
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  });

  // テーマ切り替え機能
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log(`Theme changing from ${theme} to ${newTheme}`);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const isDark = theme === "dark";

  // テーマ変更時にHTMLにdata-theme属性を適用
  useEffect(() => {
    const root = document.documentElement;

    console.log(`Applying theme: ${theme}`);

    // data-theme属性を設定
    root.setAttribute("data-theme", theme);

    // Tailwind CSS v4のdarkクラスも設定
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // color-schemeプロパティを設定（スクロールバーなどのブラウザコンポーネント用）
    root.style.colorScheme = theme;

    // デバッグ用：現在のCSS変数の値を確認
    const computedStyles = getComputedStyle(root);
    console.log("Current CSS variables:", {
      bgColor: computedStyles.getPropertyValue("--color-bg"),
      mainColor: computedStyles.getPropertyValue("--color-main"),
      textPrimary: computedStyles.getPropertyValue("--color-text-primary"),
      bgPrimary: computedStyles.getPropertyValue("--color-bg-primary"),
    });
  }, [theme]);

  // システム設定の変更を監視
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      // ローカルストレージに保存されたテーマがない場合のみシステム設定に従う
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
