import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
}

// Finexy pill buttons. primary = #1E1E1C dark pill ("Transfer"); outline = #F5F5F5 grey
// pill ("Request" / "+ Add new"). md = 57px / 20px text; sm = 44px / 17px text.
const SIZE = {
  sm: "h-[44px] px-[20px] text-fx-17 gap-[8px]",
  md: "h-[50px] px-[22px] text-fx-20 gap-[10px] md:h-[57px] md:px-[32px]",
};

const VARIANT = {
  primary: "bg-dark text-on-dark hover:opacity-95",
  outline: "bg-tile text-ink hover:bg-hover",
};

/** The same pill styling for links that navigate (so a link is never wrapped around a <button>). */
export function buttonClass(variant: "primary" | "outline" = "primary", size: "sm" | "md" = "md", className = "") {
  return `inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition ${SIZE[size]} ${VARIANT[variant]} ${className}`;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      className={buttonClass(variant, size, `${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`)}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
