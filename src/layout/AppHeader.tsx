"use client";

import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils";
import { Menu, Search } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ADMIN_TABS, isTabActive } from "./adminNav";

// Finexy top bar: the ARIS Brokers logo, then floating white pills, 70px tall — centred
// tab nav pill, icon pill, profile pill.
const AppHeader: React.FC = () => {
  const t = useTranslations("header");
  const tSidebar = useTranslations("sidebar");
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const { toggleMobileSidebar } = useSidebar();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearchOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (event.key === "Escape") setSearchOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="flex items-center gap-[8px] sm:gap-[12px] xl:gap-0">
      {/* Menu pill (below xl — opens the sidebar drawer) */}
      <button
        type="button"
        className="flex size-[48px] shrink-0 items-center justify-center rounded-full bg-card text-ink sm:size-[56px] md:size-[70px] xl:hidden"
        onClick={toggleMobileSidebar}
        aria-label={t("toggleSidebar")}
      >
        <Menu size={26} strokeWidth={1.5} className="rtl:-scale-x-100" />
      </button>

      {/* ARIS Brokers logo (from arisbrokers.co.za's nav bar), sized to the pill row */}
      <Link href="/" aria-label="ARIS Brokers — home" className="flex min-w-0 shrink items-center">
        <Image
          src="/images/logo/aris-brokers.png"
          alt="ARIS Brokers"
          width={624}
          height={203}
          priority
          className="h-[30px] w-auto 2xsm:h-[36px] sm:h-[48px] md:h-[60px] xl:max-3xl:h-[50px]"
        />
      </Link>

      {/* Tab nav pill */}
      <div className="hidden min-w-0 flex-1 justify-center px-[25px] xl:flex">
        <nav
          className="flex h-[70px] w-full max-w-[765px] xl:max-3xl:h-[56px] xl:max-3xl:max-w-[640px] xl:max-3xl:px-[6px] items-center justify-between gap-[4px] rounded-full bg-card px-[10px]"
          aria-label="Primary"
        >
          {ADMIN_TABS.map(({ key, path }) => {
            const active = isTabActive(pathname, path);
            return (
              <Link
                key={key}
                href={path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-[50px] shrink-0 items-center justify-center rounded-full px-[20px] text-fx-20 xl:max-3xl:h-[44px] xl:max-3xl:px-[16px] xl:max-2xl:px-[12px] font-normal whitespace-nowrap transition-colors",
                  active ? "bg-dark text-on-dark" : "text-secondary hover:text-ink",
                )}
              >
                {tSidebar(`items.${key}`)}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Icon pill */}
      <div className="relative ms-auto flex h-[48px] shrink-0 items-center justify-evenly gap-[14px] rounded-full bg-card px-[14px] sm:h-[56px] sm:gap-[18px] sm:px-[16px] md:h-[70px] md:gap-[27px] md:w-[185px] md:px-[8px] xl:ms-0 xl:max-3xl:h-[56px] xl:max-3xl:w-[150px] xl:max-3xl:gap-[20px]">
        <button
          type="button"
          onClick={() => {
            setSearchOpen((open) => !open);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
          aria-label={t("searchPlaceholder")}
          aria-expanded={isSearchOpen}
          className="flex items-center justify-center text-ink transition-opacity hover:opacity-80"
        >
          <Search size={26} strokeWidth={1.5} className="max-sm:size-[22px] xl:max-3xl:size-[22px]" />
        </button>
        <NotificationDropdown />

        {isSearchOpen && (
          <form
            className="absolute end-0 top-[calc(100%+10px)] z-40 w-[min(420px,calc(100vw-32px))]"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex h-[54px] items-center gap-[10px] rounded-field border border-line bg-card px-[16px]">
              <Search size={20} strokeWidth={1.5} className="shrink-0 text-secondary" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t("searchPlaceholder")}
                onBlur={() => setSearchOpen(false)}
                className="w-full bg-transparent text-fx-17 text-ink outline-none placeholder:text-secondary"
              />
              <span className="shrink-0 text-fx-14 text-muted">⌘K</span>
            </div>
          </form>
        )}
      </div>

      {/* Profile pill */}
      <div className="shrink-0 xl:ms-[35px]">
        <UserDropdown />
      </div>
    </header>
  );
};

export default AppHeader;
