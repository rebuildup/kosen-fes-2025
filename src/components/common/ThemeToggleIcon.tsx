import { useTheme } from "../../context/ThemeContext";
import { SunIcon, MoonIcon } from "../icons";

const ThemeToggleIcon = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)] hover:scale-105 shadow-sm"
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
