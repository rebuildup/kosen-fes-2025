// src/utils/themeDetector.ts
export const detectSystemTheme = (): "light" | "dark" => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

export const listenForThemeChanges = (
  callback: (theme: "light" | "dark") => void
): (() => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = () => {
    callback(mediaQuery.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
};
