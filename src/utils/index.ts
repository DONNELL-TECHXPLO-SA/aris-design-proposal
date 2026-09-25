import { ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// globals.css defines the Finexy radius tokens (rounded-card, rounded-tile…). Register them
// so a radius passed through className overrides the component default instead of both
// classes surviving.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      rounded: [{ rounded: ["frame", "card", "tile", "payment", "field", "mini", "chip", "check"] }],
      // The responsive type scale (text-fx-15…). Unregistered, tailwind-merge reads these as
      // text colours and drops them whenever a colour like text-secondary follows.
      "font-size": [{ text: [(value: string) => /^fx-\d+$/.test(value)] }],
    },
  },
});

/**
 * Combines and merges Tailwind CSS class names with conditional logic.
 * @example
 * cn("bg-white", isActive && "text-black", "px-4") → "bg-white text-black px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
