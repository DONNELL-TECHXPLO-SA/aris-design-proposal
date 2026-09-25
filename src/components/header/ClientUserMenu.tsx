"use client";

import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { homeForRole, useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "@/i18n/navigation";
import { findClient } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Role } from "@/lib/mock/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const SWITCHER_ROLES: { role: Role; label: string }[] = [
  { role: "administrator", label: "Administrator" },
  { role: "manager", label: "Manager" },
  { role: "broker", label: "Broker" },
  { role: "client_primary", label: "Client Contact" },
];

export function initialsOf(name: string): string {
  return name
    .replace(/\(.*?\)|\b(SOC|Ltd|Pty|Group|Holdings)\b/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const itemClass =
  "flex h-[46px] w-full items-center rounded-full px-[14px]! py-0! text-start text-fx-17 text-ink hover:bg-tile";

// Avatar menu for the User Portal top bar — a lighter stand-in for the admin
// UserDropdown: profile, reports and sign-out, plus the prototype's role switcher.
export default function ClientUserMenu() {
  const router = useRouter();
  const { currentUser, switchTo, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const { state } = useData();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;
  const org = findClient(state, currentUser.clientId);
  const close = () => setIsOpen(false);

  const handleSwitchRole = (role: Role) => {
    const candidates = state.users.filter((u) =>
      role === "client_primary" ? u.role === "client_primary" || u.role === "client_secondary" : u.role === role,
    );
    const next = candidates.find((u) => u.id !== currentUser.id) ?? candidates[0];
    if (!next) return;
    switchTo(next.id);
    close();
    router.push(homeForRole(next.role));
  };

  return (
    <div className="relative">
      {/* Profile pill: 260×70 — avatar, name, truncated email, chevron (avatar only below lg,
          220×56 on 1280-1999px desktops to match the rest of the header) */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={isOpen}
        className="dropdown-toggle flex h-[48px] items-center gap-[12px] rounded-full bg-card p-[3px] text-start sm:h-[56px] md:h-[70px] md:p-[10px] lg:w-[260px] lg:p-0 lg:px-[10px] xl:max-3xl:h-[56px] xl:max-3xl:w-[220px] xl:max-3xl:px-[6px]"
      >
        <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-dark text-fx-17 sm:size-[50px] xl:max-3xl:size-[44px] font-semibold text-on-dark">
          {initialsOf(currentUser.name)}
        </span>
        <span className="hidden min-w-0 flex-col justify-center pe-[4px] lg:flex">
          <span className="truncate text-fx-17 leading-tight font-medium text-ink">{currentUser.name}</span>
          <span className="truncate text-fx-14 leading-tight text-secondary">{currentUser.email}</span>
        </span>
        <ChevronDown
          size={20}
          strokeWidth={1.5}
          className={`ms-auto hidden shrink-0 text-ink transition-transform duration-200 lg:block ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={close}
        className="absolute mt-[10px] flex w-[300px] flex-col p-[10px] ltr:right-0 rtl:left-0"
      >
        <div className="px-[14px] pt-[6px] pb-[12px]">
          <span className="block text-fx-17 font-medium text-ink">{currentUser.name}</span>
          <span className="mt-[2px] block truncate text-fx-14 text-secondary">{currentUser.email}</span>
          {org && (
            <span className="mt-[4px] block text-fx-14 text-muted">
              {org.name} · {currentUser.role === "client_primary" ? "Primary contact" : "Secondary contact"}
            </span>
          )}
        </div>

        <ul className="flex flex-col gap-[2px] pb-[10px]">
          <li>
            <DropdownItem tag="a" href="/portal/profile" onItemClick={close} className={itemClass}>
              Profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem tag="a" href="/portal/reports" onItemClick={close} className={itemClass}>
              Reports
            </DropdownItem>
          </li>
          <li>
            <button type="button" onClick={toggleTheme} className={itemClass}>
              Toggle dark mode
            </button>
          </li>
        </ul>

        <div className="mb-[10px] rounded-tile bg-tile p-[12px]">
          <span className="mb-[8px] block text-fx-14 text-secondary">Switch role (prototype)</span>
          <div className="grid grid-cols-2 gap-[6px]">
            {SWITCHER_ROLES.map(({ role, label }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleSwitchRole(role)}
                className="h-[36px] rounded-full bg-card px-[12px] text-start text-fx-14 font-medium text-ink hover:bg-hover"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            close();
            router.push("/signin");
          }}
          className="flex h-[44px] w-full items-center justify-center rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink hover:bg-hover"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
