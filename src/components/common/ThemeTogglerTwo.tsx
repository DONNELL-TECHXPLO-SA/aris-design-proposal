"use client";

import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils";
import { Moon as IconMoon, Sun as IconSun } from "lucide-react";

// Floating theme toggle for full-width pages — the Finexy sidebar theme pill laid
// horizontally: white pill, the active mode in a 50px #EFEFEF circle.
export default function ThemeTogglerTwo() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-[70px] items-center gap-[10px] rounded-full bg-card px-[10px] text-ink"
    >
      <span className={cn("flex size-[50px] items-center justify-center rounded-full", theme === "light" && "bg-hover")}>
        <IconSun size={22} strokeWidth={1.5} />
      </span>
      <span className={cn("flex size-[50px] items-center justify-center rounded-full", theme === "dark" && "bg-hover")}>
        <IconMoon size={22} strokeWidth={1.5} />
      </span>
    </button>
  );
}
