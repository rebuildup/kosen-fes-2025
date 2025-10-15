import { useTheme } from "../../context/ThemeContext";
import { MoonIcon, SunIcon } from "../icons";

const ThemeToggleIcon = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg bg-[var(--bg-secondary)] p-2 text-[var(--text-primary)] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:outline-none"
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
      title={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
    >
      {theme === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </button>
  );
};

export default ThemeToggleIcon;
