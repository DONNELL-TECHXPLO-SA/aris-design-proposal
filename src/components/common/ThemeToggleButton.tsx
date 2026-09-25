import { useTheme } from "@/context/ThemeContext";
import { Moon as IconMoon, Sun as IconSun } from "lucide-react";
import React from "react";

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex size-[50px] items-center justify-center rounded-full bg-card text-ink transition-colors hover:bg-hover"
    >
      {theme === "dark" ? <IconSun size={22} strokeWidth={1.5} /> : <IconMoon size={22} strokeWidth={1.5} />}
    </button>
  );
};
