import { cn } from "@/utils";
import { EllipsisVertical, Search } from "lucide-react";
import type React from "react";

/*
  Finexy building blocks. Every class string here is taken from the reference
  (DESIGNINPO src/App.tsx) — see globals.css for the token values behind bg-card,
  bg-tile, text-secondary, rounded-card, etc.
*/

/* ---------- Surfaces ---------- */

/** White card: #FFF, radius 24px, no shadow, no border. `pad` 20 (top-row cards) or 25 (lower cards). */
export function Card({
  children,
  className,
  pad = 25,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { pad?: 20 | 25 }) {
  return (
    <div className={cn("rounded-card bg-card", pad === 20 ? "p-[16px] md:p-[20px]" : "p-[18px] md:p-[25px]", className)} {...props}>
      {children}
    </div>
  );
}

/** Inner tile inside a card: #F5F5F5, radius 20px. */
export function Tile({
  children,
  className,
  pad = 20,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { pad?: 16 | 20 }) {
  return (
    <div className={cn("rounded-tile bg-tile", pad === 16 ? "p-[14px] md:p-[16px]" : "p-[16px] md:p-[20px]", className)} {...props}>
      {children}
    </div>
  );
}

/** Card header: 24px/500 section title (or 20px/500 card title) with an optional 17px grey subtitle and actions. */
export function CardHeader({
  title,
  subtitle,
  actions,
  size = "section",
  leading = "tight",
  icon,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  size?: "section" | "card";
  /** "tight" (1.25) for card titles over a subtitle; "normal" (1.5) for table-card titles, as in the reference. */
  leading?: "tight" | "normal";
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-[13px]", className)}>
      <div className="flex min-w-0 items-center gap-[12px]">
        {icon && (
          <span className="flex size-[50px] shrink-0 items-center justify-center rounded-full border border-line text-ink">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h2
            className={cn(
              size === "section" ? "text-fx-24" : "text-fx-20",
              leading === "tight" ? "leading-tight" : "leading-normal",
              "font-medium text-ink",
            )}
          >
            {title}
          </h2>
          {subtitle && <p className="mt-[4px] text-fx-17 font-normal text-secondary">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-[13px]">{actions}</div>}
    </div>
  );
}

/* ---------- Page header ---------- */

/** "Good morning, Sajibur" block: 52px/500 h1 (-0.02em) + 20px grey subtitle, 14px apart. */
export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-[20px] flex flex-wrap items-end justify-between gap-[16px] md:mb-[29px] md:gap-[20px]", className)}>
      <div className="min-w-0">
        <h1 className="text-fx-36 leading-tight font-[500] tracking-[-0.02em] text-ink md:text-fx-52">{title}</h1>
        {subtitle && <div className="mt-[8px] text-fx-17 font-normal text-secondary md:mt-[14px] md:text-fx-20">{subtitle}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-[15px]">{actions}</div>}
    </div>
  );
}

/* ---------- Badges, dots, icons ---------- */

export type Tone = "green" | "yellow" | "red" | "blue" | "muted" | "dark" | "orange";

const DOT: Record<Tone, string> = {
  green: "bg-green",
  yellow: "bg-yellow",
  red: "bg-red",
  blue: "bg-blue",
  muted: "bg-muted",
  dark: "bg-dark",
  orange: "bg-orange",
};

/** Table status: a 7px coloured dot plus the label. */
export function StatusDot({
  tone,
  children,
  size = 17,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  size?: 17 | 15;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[8px] text-ink",
        size === 17 ? "text-fx-17" : "text-fx-15",
        className,
      )}
    >
      <span className={cn("size-[7px] shrink-0 rounded-full", DOT[tone])} />
      <span>{children}</span>
    </span>
  );
}

/** ↑/↓ change chip: radius 6px, 8×2 padding. Green on #E6F6EC, red on #FDECEC, white/18 on the gradient tile. */
export function ChangeBadge({
  tone,
  children,
  size = 15,
  className,
}: {
  tone: "green" | "red" | "onGradient";
  children: React.ReactNode;
  size?: 14 | 15;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-chip px-[8px] py-[2px] font-medium",
        size === 14 ? "text-fx-14" : "text-fx-15",
        tone === "green" && "bg-green-soft text-green",
        tone === "red" && "bg-red-soft text-red",
        tone === "onGradient" && "bg-white/[0.18] text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Mini-card status word: 12px/500, green / red. */
export function StatusWord({ tone, children }: { tone: "green" | "red" | "yellow" | "muted"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "truncate text-fx-12 font-medium",
        tone === "green" && "text-green",
        tone === "red" && "text-red",
        tone === "yellow" && "text-ink",
        tone === "muted" && "text-muted",
      )}
    >
      {children}
    </span>
  );
}

/** 32px round icon beside a table row's main text (#F3F3F3). */
export function RowIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-[32px] shrink-0 items-center justify-center rounded-full bg-row-icon text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- KPI tiles ---------- */

/**
 * KPI tile: title top-left, 40px round icon top-right, 40px/500 number, optional change row.
 * Exactly one tile per group is `highlight` (the orange gradient with white text).
 */
export function KpiTile({
  title,
  icon,
  value,
  footer,
  highlight = false,
  href,
  LinkComponent,
  className,
}: {
  title: React.ReactNode;
  icon: React.ReactNode;
  value: React.ReactNode;
  footer?: React.ReactNode;
  highlight?: boolean;
  href?: string;
  LinkComponent?: React.ElementType;
  className?: string;
}) {
  const Comp: React.ElementType = href && LinkComponent ? LinkComponent : "div";
  return (
    <Comp
      {...(href && LinkComponent ? { href } : {})}
      className={cn(
        "flex min-h-[150px] flex-col justify-between gap-[16px] rounded-tile p-[16px] md:min-h-[197px] md:p-[20px]",
        highlight ? "bg-fx-gradient" : "bg-tile",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-[10px]">
        <span className={cn("text-fx-20 font-normal", highlight ? "text-white/85" : "text-ink")}>
          {title}
        </span>
        <span
          className={cn(
            "flex size-[40px] shrink-0 items-center justify-center rounded-full",
            highlight ? "bg-white/20 text-white" : "bg-icon text-ink",
          )}
        >
          {icon}
        </span>
      </div>
      <div
        className={cn(
          "tabular-numbers text-fx-40 leading-none font-[500]",
          highlight ? "text-white" : "text-ink",
        )}
      >
        {value}
      </div>
      {footer ? (
        <div className={cn("flex min-h-[27px] items-center gap-[8px] text-fx-15", highlight ? "text-white/80" : "text-secondary")}>
          {footer}
        </div>
      ) : null}
    </Comp>
  );
}

/* ---------- Mini-cards (inside a hero card's grey tile) ---------- */

/** 145×125 white mini-card: title + ⋮, 17px/500 value, 10px muted subtext, 12px status word. */
export function MiniCard({
  title,
  value,
  subtext,
  status,
  href,
  LinkComponent,
  className,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  status?: React.ReactNode;
  href?: string;
  LinkComponent?: React.ElementType;
  className?: string;
}) {
  const Comp: React.ElementType = href && LinkComponent ? LinkComponent : "div";
  return (
    <Comp
      {...(href && LinkComponent ? { href } : {})}
      className={cn(
        "flex min-h-[125px] min-w-0 flex-col justify-between gap-[6px] rounded-mini bg-card p-[12px]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-[6px]">
        <span className="truncate text-fx-15 font-medium text-ink">{title}</span>
        <EllipsisVertical size={16} className="shrink-0 text-muted" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <div className="tabular-numbers truncate text-fx-17 leading-tight font-[500] text-ink">{value}</div>
        {subtext && <div className="mt-[3px] truncate text-fx-10 leading-tight text-muted">{subtext}</div>}
      </div>
      {status ?? <span />}
    </Comp>
  );
}

/* ---------- Progress ---------- */

/** 16px bar: solid orange fill, 3px gap, diagonal-striped remainder; values underneath. */
export function ProgressBar({
  value,
  max,
  className,
  label,
}: {
  value: number;
  max: number;
  className?: string;
  label?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      className={cn("flex h-[16px] w-full items-center overflow-hidden rounded-full", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      {pct > 0 && <div className="h-[16px] shrink-0 rounded-full bg-orange" style={{ width: `${pct}%` }} />}
      {pct > 0 && pct < 100 && <div className="h-[16px] w-[3px] shrink-0 bg-card" />}
      {pct < 100 && <div className="spending-bar-remainder h-[16px] flex-1 rounded-full" />}
    </div>
  );
}

/* ---------- Table chrome ---------- */

/** Table header row search input: 54px tall, 1px #E5E5E5 border, radius 14px. */
export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex h-[54px] w-full items-center gap-[10px] rounded-field border border-line bg-card px-[16px] sm:w-[297px]",
        className,
      )}
    >
      <Search size={20} strokeWidth={1.5} className="shrink-0 text-secondary" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-fx-17 text-ink outline-none placeholder:text-secondary"
      />
    </label>
  );
}

/* ---------- Card list (policy cards) ---------- */

/** 315×198 card, radius 18px — dark (#1E1E1C, textured) or orange (#D31212). */
export function PaymentCard({
  tone,
  chip,
  children,
  className,
}: {
  tone: "dark" | "orange";
  chip?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[198px] w-[315px] max-w-full shrink-0 flex-col justify-between overflow-hidden rounded-payment p-[20px] text-white",
        tone === "dark" ? "dark-card-texture" : "bg-orange",
        className,
      )}
    >
      {tone === "dark" && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />
      )}
      {chip && (
        <div className="relative z-10 flex items-center gap-[10px]">
          <span
            className={cn(
              "rounded-full bg-white px-[10px] py-[2px] text-fx-12 font-medium",
              tone === "dark" ? "text-card-black" : "text-orange",
            )}
          >
            {chip}
          </span>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ---------- Definition list in a tile ---------- */

export function InfoGrid({
  items,
  className,
  columns = 2,
}: {
  items: { label: React.ReactNode; value: React.ReactNode }[];
  className?: string;
  columns?: 1 | 2 | 3;
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-[20px] gap-y-[16px]",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="min-w-0">
          <dt className="text-fx-15 text-secondary">{item.label}</dt>
          <dd className="mt-[2px] text-fx-17 break-words text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-tile bg-tile px-[20px] py-[40px] text-center", className)}>
      <p className="text-fx-17 font-medium text-ink">{title}</p>
      {description && <p className="mx-auto mt-[6px] max-w-[520px] text-fx-15 text-secondary">{description}</p>}
      {action && <div className="mt-[18px] flex justify-center">{action}</div>}
    </div>
  );
}

/* ---------- Greeting ---------- */

export function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
