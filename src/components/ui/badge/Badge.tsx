import { cn } from "@/utils";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
}

// Finexy status: "light" renders the table status pattern — a 7px coloured dot plus the
// label (green = settled/approved, yellow = in progress, red = pending/rejected).
// "solid" renders a filled 6px-radius chip.
const DOT: Record<BadgeColor, string> = {
  primary: "bg-orange",
  success: "bg-green",
  error: "bg-red",
  warning: "bg-yellow",
  info: "bg-blue",
  light: "bg-muted",
  dark: "bg-dark",
};

const SOLID: Record<BadgeColor, string> = {
  primary: "bg-orange text-white",
  success: "bg-green text-white",
  error: "bg-red text-white",
  warning: "bg-yellow text-card-black",
  info: "bg-blue text-white",
  light: "bg-tile text-ink",
  dark: "bg-dark text-on-dark",
};

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const text = size === "sm" ? "text-fx-15" : "text-fx-17";

  if (variant === "solid") {
    return (
      <span className={cn("inline-flex items-center gap-[4px] rounded-chip px-[8px] py-[2px] font-medium", text, SOLID[color])}>
        {startIcon}
        {children}
        {endIcon}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-[8px] font-normal text-ink", text)}>
      {startIcon ?? <span className={cn("size-[7px] shrink-0 rounded-full", DOT[color])} />}
      <span>{children}</span>
      {endIcon}
    </span>
  );
};

export default Badge;
