"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils";
import { CLIENT_NAV_ITEMS, isClientNavActive } from "./clientNav";

// Mobile primary nav for the User/Client Portal, per §10.2/§20.2 ("bottom nav, primary
// on mobile"). Hidden at md+ where ClientTopNav carries the same items. Styled as a
// floating Finexy nav pill: white, fully rounded, active item a #1E1E1C pill.
export default function ClientBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-[12px] bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 flex gap-[4px] rounded-full bg-card p-[5px] md:hidden">
      {CLIENT_NAV_ITEMS.map(({ href, shortLabel, icon: Icon }) => {
        const isActive = isClientNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-[56px] min-w-0 flex-1 flex-col items-center justify-center gap-[2px] rounded-full text-fx-12 font-medium",
              isActive ? "bg-dark text-on-dark" : "text-secondary",
            )}
          >
            <Icon size={22} strokeWidth={1.5} />
            {shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
