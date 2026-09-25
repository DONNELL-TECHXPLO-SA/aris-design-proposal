import type { Role } from "@/lib/mock/types";
import {
  FilePlus2,
  History,
  Layers,
  LayoutGrid,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

// Role-based Admin Portal nav, per ux-blueprint.md §7.3/§7.4/§3.1: Company & Report
// Settings and Users & Access never render for a Broker (not greyed out — absent).
// Manager sees everything Broker sees (plus unscoped data, applied at the query level,
// not the nav level) but not those two Administrator-only items.
//
// Laid out on the Finexy shell: the section-level destinations everyone has live in the
// top tab pill; the icon sidebar carries the dashboard plus the second-level and
// Administrator-only destinations. Labels are the `sidebar.items.*` i18n keys.

export interface AdminTab {
  key: string;
  path: string;
}

export interface AdminSidebarItem {
  key: string;
  path: string;
  icon: LucideIcon;
}

export const ADMIN_TABS: AdminTab[] = [
  { key: "dashboard", path: "/" },
  { key: "claims", path: "/claims" },
  { key: "clientsPolicies", path: "/clients" },
  { key: "reports", path: "/reports" },
  { key: "auditTrail", path: "/audit" },
];

export function getSidebarItems(role: Role): AdminSidebarItem[] {
  const items: AdminSidebarItem[] = [
    { key: "dashboard", path: "/", icon: LayoutGrid },
    { key: "claimsNew", path: "/claims/new", icon: FilePlus2 },
    { key: "reportsHistory", path: "/reports/history", icon: History },
  ];

  if (role === "administrator") {
    items.push(
      { key: "usersAccess", path: "/users", icon: Users },
      { key: "productConfig", path: "/settings/products", icon: Layers },
      { key: "companySettings", path: "/settings/company", icon: Settings },
    );
  }

  return items;
}

// A tab owns its whole route subtree ("/claims" is active on "/claims/abc/documents");
// the dashboard only matches exactly.
export function isTabActive(pathname: string, path: string): boolean {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

// Sidebar items are specific destinations: exact match, except the admin sections
// that own a subtree (e.g. "/users/new" keeps Users & Access lit).
export function isSidebarItemActive(pathname: string, path: string): boolean {
  if (path === "/users") return pathname === "/users" || pathname.startsWith("/users/");
  return pathname === path;
}
