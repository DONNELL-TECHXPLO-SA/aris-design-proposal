import { cn } from "@/utils";

interface WordmarkProps {
  /** "full" — logo mark + "ARIS" name (the Finexy logo pill contents); "mark" — the orange circle alone. */
  variant?: "full" | "mark";
  /** "brand" for light surfaces; "inverted" for dark surfaces (e.g. the auth side panel). */
  tone?: "brand" | "inverted";
  className?: string;
  /** Extra classes for the "ARIS" name (e.g. hide it on the narrowest screens). */
  nameClassName?: string;
}

// The Finexy logo mark: a 50px #D31212 circle holding the brand glyph. ARIS has no
// image asset, so the glyph is the "A" monogram.
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-[50px] shrink-0 items-center justify-center rounded-full bg-orange text-fx-24 leading-none font-semibold text-white",
        className,
      )}
      aria-hidden="true"
    >
      A
    </span>
  );
}

export default function Wordmark({ variant = "full", tone = "brand", className = "", nameClassName = "" }: WordmarkProps) {
  if (variant === "mark") {
    return <LogoMark className={className} />;
  }

  return (
    <span className={cn("flex items-center gap-[12px]", className)}>
      <LogoMark />
      <span
        className={cn(
          "text-fx-20 font-semibold tracking-tight",
          tone === "inverted" ? "text-white" : "text-ink",
          nameClassName,
        )}
      >
        ARIS
      </span>
    </span>
  );
}
