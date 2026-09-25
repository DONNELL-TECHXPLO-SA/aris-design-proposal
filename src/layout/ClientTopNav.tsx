"use client";

import ClientUserMenu, { initialsOf } from "@/components/header/ClientUserMenu";
import { useAuth } from "@/context/AuthContext";
import { Link, usePathname } from "@/i18n/navigation";
import { findClient } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { cn } from "@/utils";
import { CLIENT_NAV_ITEMS, isClientNavActive } from "./clientNav";

// Top nav for the User/Client Portal (UC-03). No sidebar — the client org's own
// identity on the left, "powered by" the Broker underneath, so a client never mistakes
// this for the Broker's internal tool. The mobile equivalent of the nav links is
// ClientBottomNav. Rendered as the Finexy top bar: separate floating 70px white pills —
// the logo pill (orange circle holding the org's initials), the centred tab nav pill
// and the profile pill.
export default function ClientTopNav() {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { state } = useData();
  const org = findClient(state, currentUser?.clientId);
  const brokerName = state.companySettings.companyName.replace(/\s*\(Pty\)\s*Ltd\.?$/i, "");

  return (
    <header className="flex items-center gap-[12px] xl:gap-0">
      <Link
        href="/portal"
        className="flex h-[56px] min-w-0 items-center gap-[12px] rounded-full bg-card ps-[3px] pe-[22px] md:h-[70px] md:ps-[10px] md:max-xl:pe-[10px] xl:max-3xl:h-[56px] xl:max-3xl:ps-[3px]"
      >
        <span className="flex size-[50px] shrink-0 xl:max-3xl:size-[44px] items-center justify-center rounded-full bg-orange text-fx-17 font-semibold tracking-wide text-white">
          {org ? initialsOf(org.name) : "—"}
        </span>
        <span className="min-w-0 leading-tight md:max-xl:hidden">
          <span className="block truncate text-fx-20 font-semibold tracking-tight text-ink">{org?.name ?? "Claims portal"}</span>
          <span className="block truncate text-fx-14 text-secondary">Claims portal · powered by {brokerName}</span>
        </span>
      </Link>

      <div className="hidden min-w-0 flex-1 justify-center px-[25px] md:flex">
        <nav className="flex h-[70px] items-center xl:max-3xl:h-[56px] xl:max-3xl:px-[6px] gap-[4px] rounded-full bg-card px-[10px]" aria-label="Primary">
          {CLIENT_NAV_ITEMS.map(({ href, label }) => {
            const isActive = isClientNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-[50px] items-center xl:max-3xl:h-[44px] xl:max-3xl:px-[16px] rounded-full px-[20px] text-fx-17 whitespace-nowrap transition-colors lg:text-fx-20",
                  isActive ? "bg-dark text-on-dark" : "text-secondary hover:text-ink",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="ms-auto shrink-0 md:ms-0">
        <ClientUserMenu />
      </div>
    </header>
  );
}
