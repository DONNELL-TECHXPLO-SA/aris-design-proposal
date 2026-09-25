"use client";

import {
  Bell as IconBell,
  ClipboardCheck,
  Clock,
  FilePlus2,
  FileWarning,
  PenLine,
  ShieldAlert,
  X as IconX,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Sample notifications for the prototype, drawn from the seeded claims in
// src/lib/mock/seed.ts. Swap for the store's feed once notifications are modelled.
type NotificationKind =
  | "documentOutstanding"
  | "assessmentSubmitted"
  | "decisionDisputed"
  | "aolAwaiting"
  | "claimStarted"
  | "insurerDecisionDue";

interface NotificationItem {
  id: string;
  kind: NotificationKind;
  href: string;
  icon: LucideIcon;
  tone?: "alert";
  unread?: boolean;
  values: Record<string, string> & { client: string };
  age: { unit: "minAgo" | "hrAgo" | "dayAgo"; count: number };
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1011-dispute",
    kind: "decisionDisputed",
    href: "/claims/cl-1011/decision",
    icon: ShieldAlert,
    tone: "alert",
    unread: true,
    values: { actor: "Karin Fourie", reference: "ARB-2026-1011", client: "Baobab Health Services" },
    age: { unit: "minAgo", count: 5 },
  },
  {
    id: "n-1004-assessment",
    kind: "assessmentSubmitted",
    href: "/claims/cl-1004/insurer-assessor",
    icon: ClipboardCheck,
    unread: true,
    values: { actor: "Chris Oosthuizen", reference: "ARB-2026-1004", client: "Vantage Manufacturing" },
    age: { unit: "minAgo", count: 32 },
  },
  {
    id: "n-1002-docs",
    kind: "documentOutstanding",
    href: "/claims/cl-1002/documents",
    icon: FileWarning,
    values: { document: "Quotation for repairs", reference: "ARB-2026-1002", client: "Coastal Logistics (Pty) Ltd" },
    age: { unit: "hrAgo", count: 1 },
  },
  {
    id: "n-1001-started",
    kind: "claimStarted",
    href: "/claims/cl-1001",
    icon: FilePlus2,
    values: { actor: "Lindiwe Dube", section: "Motor", reference: "ARB-2026-1001", client: "Metro Facilities Group" },
    age: { unit: "hrAgo", count: 3 },
  },
  {
    id: "n-1005-aol",
    kind: "aolAwaiting",
    href: "/claims/cl-1005/decision",
    icon: PenLine,
    values: { reference: "ARB-2026-1005", client: "Baobab Health Services" },
    age: { unit: "dayAgo", count: 1 },
  },
  {
    id: "n-1010-insurer",
    kind: "insurerDecisionDue",
    href: "/claims/cl-1010",
    icon: Clock,
    values: { insurer: "Horizon Underwriting Managers", reference: "ARB-2026-1010", client: "Vantage Manufacturing" },
    age: { unit: "dayAgo", count: 2 },
  },
];

export default function NotificationDropdown() {
  const t = useTranslations("header.notifications");
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };
  return (
    <div className="relative flex">
      <button
        className="dropdown-toggle relative flex items-center justify-center text-ink transition-opacity hover:opacity-80"
        onClick={handleClick}
        aria-label={t("title")}
      >
        <IconBell size={26} strokeWidth={1.5} className="xl:max-3xl:size-[22px]" />
        {/* 7px orange dot at top right */}
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 size-[7px] rounded-full bg-orange",
            !notifying && "hidden",
          )}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute top-[calc(100%+32px)] -end-[80px] flex h-[480px] w-[360px] max-w-[calc(100vw-32px)] flex-col p-[10px]"
      >
        <div className="flex items-center justify-between px-[10px] pt-[6px] pb-[12px]">
          <h5 className="text-fx-20 font-medium text-ink">
            {t("title")}
          </h5>
          <button
            onClick={toggleDropdown}
            className="dropdown-toggle flex size-[40px] items-center justify-center rounded-full bg-tile text-ink"
          >
            <IconX size={20} strokeWidth={1.5} />
          </button>
        </div>

        <ul className="custom-scrollbar flex h-auto flex-col gap-[2px] overflow-y-auto">
          {NOTIFICATIONS.map(({ id, kind, href, icon: Icon, tone, unread, values, age }) => (
            <li key={id}>
              <DropdownItem
                tag="a"
                href={href}
                onItemClick={closeDropdown}
                className="flex gap-[12px] rounded-mini! p-[12px]! hover:bg-tile"
              >
                <span
                  className={cn(
                    "relative flex size-[40px] shrink-0 items-center justify-center rounded-full",
                    tone === "alert" ? "bg-red-soft text-red" : "bg-tile text-ink",
                  )}
                >
                  <Icon size={20} strokeWidth={1.5} />
                  {unread && (
                    <span className="absolute end-0 top-0 size-[10px] rounded-full border-[1.5px] border-card bg-orange" />
                  )}
                </span>

                <span className="block min-w-0">
                  <span className="mb-[4px] block text-fx-15 text-secondary">
                    {t.rich(`items.${kind}`, {
                      ...values,
                      b: (chunks) => <span className="font-medium text-ink">{chunks}</span>,
                    })}
                  </span>

                  <span className="flex items-center gap-[8px] text-fx-14 text-muted">
                    <span className="truncate">{values.client}</span>
                    <span className="size-[4px] shrink-0 rounded-full bg-muted"></span>
                    <span className="shrink-0">{t(age.unit, { count: age.count })}</span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>
        <Link
          href="/audit"
          onClick={closeDropdown}
          className="mt-[10px] flex h-[44px] items-center justify-center rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink hover:bg-hover"
        >
          {t("viewAll")}
        </Link>
      </Dropdown>
    </div>
  );
}
