import { ChatIcon, FolderIcon, ListIcon } from "@/icons";

// Shared by ClientTopNav (desktop) and ClientBottomNav (mobile). Profile and Reports
// live in the avatar menu (ClientUserMenu) to keep the primary nav to three items.
// `shortLabel` is what fits a third of a phone-width bottom bar.
export const CLIENT_NAV_ITEMS = [
  { href: "/portal", label: "My Claims", shortLabel: "Claims", icon: ListIcon },
  { href: "/portal/documents", label: "Documents", shortLabel: "Documents", icon: FolderIcon },
  { href: "/portal/contact", label: "Contact Broker", shortLabel: "Contact", icon: ChatIcon },
] as const;

// "My Claims" also owns the claim detail and lodgement pages under /portal/claims.
export function isClientNavActive(pathname: string, href: string): boolean {
  if (href === "/portal") return pathname === "/portal" || pathname.startsWith("/portal/claims");
  return pathname.startsWith(href);
}
