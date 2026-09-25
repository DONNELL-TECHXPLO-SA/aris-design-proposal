import { Inter } from "next/font/google";

// Finexy typeface. The reference loads Inter 400/500/600/700.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

// ApexCharts/jsvectormap write font-family as an SVG attribute, which can't read CSS
// variables, so charts use the resolved family name from next/font.
export const chartFontFamily = inter.style.fontFamily;
