"use client";

import Wordmark from "@/components/common/Wordmark";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/utils";
import { LogOut, Moon, Sun, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useSidebar } from "../context/SidebarContext";
import { ADMIN_TABS, getSidebarItems, isSidebarItemActive, isTabActive } from "./adminNav";

// Finexy left sidebar: a 70px icon-only column of stacked white pills — theme toggle
// on top, the main nav group (active item in a 50px #1E1E1C circle), sign-out at the
// bottom. Below xl it collapses into a drawer (opened from the header) that lists the
// tab destinations and the sidebar destinations with labels.
const AppSidebar: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("sidebar");
  const { currentUser, logout } = useAuth();
  const { theme, setThemeMode } = useTheme();
  const items = useMemo(() => getSidebarItems(currentUser?.role ?? "broker"), [currentUser?.role]);

  const handleSignOut = () => {
    logout();
    router.push("/signin");
  };

  return (
    <>
      {/* Desktop: icon column */}
      <aside className="hidden w-[56px] shrink-0 xl:block 3xl:w-[70px]" aria-label="Sidebar">
        {/* Fills the fixed app frame height (header + frame inset already consume the
            rest), so the theme pill sits at the top and the sign-out pill lands on the
            frame's bottom edge. Falls back to an invisible inner scroll on short viewports. */}
        <div className="no-scrollbar flex h-full min-h-0 flex-col overflow-y-auto">
          {/* Theme pill: 70×130 (56×104 below 3xl) */}
          <div className="flex h-[104px] w-[56px] flex-col items-center justify-between rounded-full bg-card py-[7px] 3xl:h-[130px] 3xl:w-[70px] 3xl:py-[10px]">
            <button
              type="button"
              onClick={() => setThemeMode("light")}
              aria-label="Light mode"
              aria-pressed={theme === "light"}
              className={cn(
                "flex size-[42px] shrink-0 items-center justify-center rounded-full text-ink 3xl:size-[50px]",
                theme === "light" && "bg-hover",
              )}
            >
              <Sun size={22} strokeWidth={1.5} className="size-[20px] 3xl:size-[22px]" />
            </button>
            <button
              type="button"
              onClick={() => setThemeMode("dark")}
              aria-label="Dark mode"
              aria-pressed={theme === "dark"}
              className={cn(
                "flex size-[42px] shrink-0 items-center justify-center rounded-full text-ink 3xl:size-[50px]",
                theme === "dark" && "bg-hover",
              )}
            >
              <Moon size={22} strokeWidth={1.5} className="size-[20px] 3xl:size-[22px]" />
            </button>
          </div>

          {/* Main nav pill */}
          <nav className="mt-[60px] flex w-[56px] flex-col items-center gap-[10px] rounded-full bg-card py-[7px] 3xl:mt-[95px] 3xl:w-[70px] 3xl:gap-[14px] 3xl:py-[10px]">
            {items.map(({ key, path, icon: Icon }) => {
              const active = isSidebarItemActive(pathname, path);
              return (
                <Link
                  key={key}
                  href={path}
                  title={t(`items.${key}`)}
                  aria-label={t(`items.${key}`)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-[42px] shrink-0 items-center justify-center rounded-full 3xl:w-[50px]",
                    active ? "h-[42px] bg-dark text-on-dark 3xl:h-[50px]" : "h-[40px] text-ink hover:bg-hover 3xl:h-[46px]",
                  )}
                >
                  <Icon size={22} strokeWidth={1.5} className="size-[20px] 3xl:size-[22px]" />
                </Link>
              );
            })}
          </nav>

          {/* Bottom pill: sign out */}
          <div className="mt-auto flex w-[56px] flex-col items-center rounded-full bg-card py-[7px] 3xl:w-[70px] 3xl:py-[15px]">
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-ink hover:bg-hover 3xl:h-[45px] 3xl:w-[50px]"
            >
              <LogOut size={22} strokeWidth={1.5} className="size-[20px] rtl:-scale-x-100 3xl:size-[22px]" />
            </button>
          </div>
        </div>
      </aside>

      {/* Below xl: drawer */}
      {isMobileOpen && (
        <aside
          className="fixed inset-y-[12px] start-[12px] z-50 flex w-[300px] max-w-[calc(100vw-24px)] flex-col overflow-y-auto rounded-card bg-card p-[20px] xl:hidden"
          aria-label="Navigation"
        >
          <div className="flex items-center justify-between">
            <Link href="/">
              <Wordmark />
            </Link>
            <button
              type="button"
              onClick={toggleMobileSidebar}
              aria-label="Close menu"
              className="flex size-[40px] items-center justify-center rounded-full bg-tile text-ink"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="mt-[25px] flex flex-col gap-[4px]">
            {ADMIN_TABS.map(({ key, path }) => {
              const active = isTabActive(pathname, path);
              return (
                <Link
                  key={key}
                  href={path}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-[50px] items-center rounded-full px-[20px] text-fx-17",
                    active ? "bg-dark text-on-dark" : "text-secondary hover:text-ink",
                  )}
                >
                  {t(`items.${key}`)}
                </Link>
              );
            })}
          </nav>

          <nav className="mt-[20px] flex flex-col gap-[4px] rounded-tile bg-tile p-[10px]">
            {items
              .filter((item) => item.key !== "dashboard")
              .map(({ key, path, icon: Icon }) => {
                const active = isSidebarItemActive(pathname, path);
                return (
                  <Link
                    key={key}
                    href={path}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-[46px] items-center gap-[12px] rounded-full px-[14px] text-fx-17",
                      active ? "bg-dark text-on-dark" : "text-ink hover:bg-card",
                    )}
                  >
                    <Icon size={22} strokeWidth={1.5} />
                    {t(`items.${key}`)}
                  </Link>
                );
              })}
          </nav>

          <div className="mt-auto flex items-center gap-[10px] pt-[20px]">
            <div className="flex items-center gap-[4px] rounded-full bg-tile p-[5px]">
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                aria-label="Light mode"
                className={cn("flex size-[40px] items-center justify-center rounded-full text-ink", theme === "light" && "bg-card")}
              >
                <Sun size={20} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                aria-label="Dark mode"
                className={cn("flex size-[40px] items-center justify-center rounded-full text-ink", theme === "dark" && "bg-card")}
              >
                <Moon size={20} strokeWidth={1.5} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="ms-auto flex h-[50px] items-center gap-[10px] rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink"
            >
              <LogOut size={20} strokeWidth={1.5} className="rtl:-scale-x-100" />
              Sign out
            </button>
          </div>
        </aside>
      )}
    </>
  );
};

export default AppSidebar;
