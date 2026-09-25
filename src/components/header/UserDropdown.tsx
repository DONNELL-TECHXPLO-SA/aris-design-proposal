"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import { CircleHelp as IconHelpCircle, Settings as IconSettings, CircleUser as IconUserCircle, Globe as IconWorld } from "lucide-react";
import { getLanguage, languages } from "@/i18n/languages";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { ChevronDownIcon } from "@/icons";
import { cn } from "@/utils";
import { homeForRole, useAuth } from "@/context/AuthContext";
import { useData } from "@/lib/mock/store";
import type { Role } from "@/lib/mock/types";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const SWITCHER_ROLES: { role: Role; label: string }[] = [
  { role: "administrator", label: "Administrator" },
  { role: "manager", label: "Manager" },
  { role: "broker", label: "Broker" },
  { role: "client_primary", label: "Client Contact" },
];

export default function UserDropdown() {
  const t = useTranslations("userDropdown");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, switchTo, logout } = useAuth();
  const { state } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const subDropdownRef = useRef<HTMLLIElement>(null);

  const currentLang = getLanguage(locale);
  const CurrentFlagIcon = currentLang.FlagIcon;

  useClickOutside(subDropdownRef, () => {
    setIsSubDropdownOpen(false);
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsSubDropdownOpen(false);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setIsSubDropdownOpen(false);
  };

  const handleSelectLanguage = (id: Locale) => {
    router.replace(pathname, { locale: id });
    setIsSubDropdownOpen(false);
  };

  const handleSwitchRole = (role: Role) => {
    const candidates = state.users.filter((u) =>
      role === "client_primary" ? u.role === "client_primary" || u.role === "client_secondary" : u.role === role,
    );
    const next = candidates.find((u) => u.id !== currentUser?.id) ?? candidates[0];
    if (!next) return;
    switchTo(next.id);
    closeDropdown();
    router.push(homeForRole(next.role));
  };

  const handleSignOut = () => {
    logout();
    closeDropdown();
    router.push("/signin");
  };

  const itemClass =
    "group flex h-[46px] items-center gap-[12px] rounded-full px-[14px]! py-0! text-fx-17 font-normal text-ink hover:bg-tile";

  return (
    <div className="relative">
      {/* Profile pill: 260×70 — avatar, name, truncated email, chevron */}
      <button
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        className="dropdown-toggle flex h-[48px] items-center gap-[12px] rounded-full bg-card p-[3px] text-start sm:h-[56px] md:h-[70px] md:w-[260px] md:p-0 md:px-[10px] xl:max-3xl:h-[56px] xl:max-3xl:w-[220px] xl:max-3xl:px-[6px]"
      >
        <span className="size-[42px] shrink-0 overflow-hidden rounded-full sm:size-[50px] xl:max-3xl:size-[44px]">
          <Image
            width={50}
            height={50}
            src="/images/user/owner.png"
            alt="User"
          />
        </span>

        <span className="hidden min-w-0 flex-col justify-center pe-[4px] md:flex">
          <span className="truncate text-fx-17 leading-tight font-medium text-ink">
            {currentUser?.name ?? "Account"}
          </span>
          <span className="truncate text-fx-14 leading-tight text-secondary">
            {currentUser?.email ?? ""}
          </span>
        </span>

        <ChevronDownIcon
          size={20}
          className={`ms-auto hidden shrink-0 text-ink transition-transform duration-200 md:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute mt-[10px] flex w-[300px] flex-col p-[10px] ltr:right-0 rtl:right-auto rtl:left-0"
      >
        <div className="px-[14px] pt-[6px] pb-[12px]">
          <span className="block text-fx-17 font-medium text-ink">
            {currentUser?.name ?? "Not signed in"}
          </span>
          <span className="mt-[2px] block truncate text-fx-14 text-secondary">
            {currentUser?.email ?? ""}
          </span>
        </div>

        <div className="rounded-tile bg-tile p-[12px]">
          <span className="mb-[8px] block text-fx-14 text-secondary">
            Switch role (prototype)
          </span>
          <div className="grid grid-cols-2 gap-[6px]">
            {SWITCHER_ROLES.map(({ role, label }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleSwitchRole(role)}
                className={cn(
                  "h-[36px] rounded-full px-[12px] text-start text-fx-14 font-medium transition-colors",
                  currentUser?.role === role ||
                    (role === "client_primary" && currentUser?.role === "client_secondary")
                    ? "bg-dark text-on-dark"
                    : "bg-card text-ink hover:bg-hover",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-[2px] py-[10px]">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className={itemClass}
            >
              <IconUserCircle className="text-ink" size={22} strokeWidth={1.5} />
              {t("editProfile")}
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className={itemClass}
            >
              <IconSettings className="text-ink" size={22} strokeWidth={1.5} />
              {t("accountSettings")}
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className={itemClass}
            >
              <IconHelpCircle className="text-ink" size={22} strokeWidth={1.5} />
              {t("support")}
            </DropdownItem>
          </li>
          <li className="relative" ref={subDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSubDropdownOpen((prev) => !prev)}
              className={cn(
                "flex h-[46px] w-full items-center justify-between gap-[8px] rounded-full px-[14px] text-fx-17 text-ink transition-colors",
                isSubDropdownOpen ? "bg-tile" : "hover:bg-tile",
              )}
            >
              <span className="flex items-center gap-[12px]">
                <IconWorld className="text-ink" size={22} strokeWidth={1.5} />
                <span>{t("language")}</span>
              </span>

              <span className="flex items-center gap-[6px] rounded-full border border-line bg-card px-[10px] py-[2px] text-fx-14 font-medium text-ink">
                <span>{currentLang.shortName}</span>
                <CurrentFlagIcon className="size-[14px] shrink-0 overflow-hidden rounded-full" />
              </span>
            </button>

            {isSubDropdownOpen && (
              <div className="absolute top-[50px] z-10 w-[250px] rounded-tile border border-line bg-card p-[8px] md:top-0 ltr:-left-2 ltr:md:right-[calc(100%+20px)] ltr:md:left-auto rtl:-right-2 rtl:md:right-auto rtl:md:left-[calc(100%+20px)]">
                <ul className="flex flex-col gap-[2px]">
                  {languages.map((language) => {
                    const isSelected = locale === language.id;
                    const FlagIcon = language.FlagIcon;

                    return (
                      <li key={language.id}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectLanguage(language.id);
                          }}
                          className={cn(
                            "flex h-[44px] w-full items-center justify-between gap-[8px] rounded-full px-[12px] text-start text-fx-15 text-ink transition-colors",
                            isSelected ? "bg-tile" : "hover:bg-tile",
                          )}
                        >
                          <span className="flex items-center gap-[8px]">
                            <span
                              className={cn(
                                "size-[7px] shrink-0 rounded-full",
                                isSelected ? "bg-orange" : "opacity-0",
                              )}
                            />
                            <FlagIcon className="size-[18px] shrink-0 overflow-hidden rounded-full" />
                            <span className="truncate">{language.name}</span>
                          </span>

                          {language.badge && (
                            <span className="text-fx-12 font-medium text-secondary">
                              {language.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        </ul>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-[44px] w-full items-center justify-center rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink hover:bg-hover"
        >
          {t("signOut")}
        </button>
      </Dropdown>
    </div>
  );
}
