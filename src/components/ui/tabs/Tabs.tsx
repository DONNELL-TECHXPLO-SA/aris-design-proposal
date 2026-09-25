"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";
import { useEffect, useRef } from "react";

export interface TabItem {
  key: string;
  label: string;
  badge?: number;
  /** When set, the tab renders as a link (route-based tabs) instead of a state toggle. */
  href?: string;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange?: (key: string) => void;
  className?: string;
}

// Shared tab primitive — used by admin Claim Detail (Overview/Documents/Insurer &
// Assessor/Decision & Settlement/Financials/Communication/Comments/Activity, §7.3).
// Supports both route-based tabs (pass `href` per item) and controlled in-page tabs
// (omit `href`, handle `onChange`).
// Styled as the Finexy tab nav pill: white 70px pill, 50px tabs, the active tab a
// #1E1E1C pill with white text, the rest grey. On narrow screens the pill scrolls
// sideways; the active tab is kept in view.
const Tabs: React.FC<TabsProps> = ({
  tabs,
  active,
  onChange,
  className = "",
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const tab = scroller?.querySelector<HTMLElement>("[data-active='true']");
    if (!scroller || !tab) return;
    const left = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <div
      ref={scrollerRef}
      className={cn("no-scrollbar overflow-x-auto", className)}
    >
      <nav className="relative flex h-[56px] w-max min-w-full items-center gap-[4px] rounded-full bg-card px-[5px] md:h-[70px] md:px-[10px]">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          const content = (
            <>
              {tab.label}
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={cn(
                    "tabular-numbers rounded-chip px-[6px] text-fx-14 font-medium",
                    isActive ? "bg-white/20 text-on-dark" : "bg-tile text-ink",
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </>
          );
          const className = cn(
            "flex h-[46px] shrink-0 items-center gap-[8px] rounded-full px-[16px] text-fx-17 font-normal whitespace-nowrap transition-colors md:h-[50px] md:px-[20px] md:text-fx-20",
            isActive ? "bg-dark text-on-dark" : "text-secondary hover:text-ink",
          );
          return tab.href ? (
            <Link
              key={tab.key}
              href={tab.href}
              className={className}
              data-active={isActive}
              aria-current={isActive ? "page" : undefined}
            >
              {content}
            </Link>
          ) : (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange?.(tab.key)}
              className={className}
              data-active={isActive}
              aria-pressed={isActive}
            >
              {content}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
