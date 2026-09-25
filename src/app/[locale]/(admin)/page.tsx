"use client";

import ClaimsTable from "@/components/claims/ClaimsTable";
import { buttonClass } from "@/components/ui/button/Button";
import { Card, CardHeader, KpiTile, MiniCard, PageHeader, StatusWord, Tile, greetingFor } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { findClient, findUser, needsAttentionClaims, sortClaimsByAttention } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";
import { statusColor, statusLabel } from "@/lib/mock/status";
import type { Claim, MockState } from "@/lib/mock/types";
import { ChevronRight, CircleAlert, Clock, FilePlus2, FileText, Layers, List, Users } from "lucide-react";
import { useState } from "react";

// ux-blueprint.md §13 — role-varying dashboards. Deliberately no charts/vanity metrics
// (§13.4: "if a number can only be produced by running a report, it's report content,
// not dashboard content") — every tile here is a live, actionable filter/count.
//
// Laid out on the Finexy dashboard grid: row 1 is three 535px-proportioned columns
// (hero card · 2×2 KPI card · list card), row 2 the claims table at full width.

function HeroCard({
  label,
  count,
  subline,
  actions,
  attention,
  state,
}: {
  label: string;
  count: number;
  subline: string;
  actions: React.ReactNode;
  attention: Claim[];
  state: MockState;
}) {
  const top = attention.slice(0, 3);
  return (
    <Card pad={20} className="flex min-h-[450px] flex-col justify-between gap-[20px]">
      <div>
        <div className="flex min-h-[34px] items-center text-fx-20 font-normal text-secondary">{label}</div>
        <div className="tabular-numbers mt-[8px] text-fx-38 leading-none font-[500] text-ink">{count}</div>
        <div className="mt-[10px] flex min-h-[25px] items-center text-fx-15 font-normal text-secondary">{subline}</div>
        <div className="mt-[18px] grid grid-cols-2 gap-[15px]">{actions}</div>
      </div>

      <Tile pad={16} className="flex min-h-[187px] flex-col justify-between gap-[4px]">
        <div className="flex items-center gap-[8px] text-fx-17">
          <span className="font-medium text-ink">Needs attention</span>
          <span className="text-sep">|</span>
          <span className="text-secondary">
            {attention.length > 3 ? `Top 3 of ${attention.length}` : `Total ${attention.length}`}
          </span>
        </div>
        {top.length === 0 ? (
          <p className="py-[20px] text-center text-fx-15 text-secondary">Nothing currently needs attention.</p>
        ) : (
          <div className="grid grid-cols-3 gap-[15px]">
            {top.map((claim) => {
              const color = statusColor(claim.status);
              return (
                <MiniCard
                  key={claim.id}
                  href={`/claims/${claim.id}`}
                  LinkComponent={Link}
                  title={claim.reference.replace(/^ARB-/, "")}
                  value={claim.claimType}
                  subtext={findClient(state, claim.clientId)?.name}
                  status={
                    <StatusWord tone={color === "success" ? "green" : color === "error" ? "red" : "muted"}>
                      {statusLabel(claim.status)}
                    </StatusWord>
                  }
                />
              );
            })}
          </div>
        )}
      </Tile>
    </Card>
  );
}

function ListCard({
  title,
  subtitle,
  rows,
  empty,
}: {
  title: string;
  subtitle: string;
  rows: { key: string; label: string; value: string; href?: string }[];
  empty: string;
}) {
  return (
    <Card pad={20} className="flex min-h-[450px] flex-col justify-between gap-[18px]">
      <CardHeader title={title} subtitle={subtitle} />
      <Tile className="custom-scrollbar flex flex-1 flex-col gap-[10px] overflow-y-auto 2xl:h-[332px] 2xl:flex-none">
        {rows.length === 0 && <p className="text-fx-15 text-secondary">{empty}</p>}
        {rows.map((row) => {
          const content = (
            <>
              <span className="min-w-0 truncate text-fx-17 text-ink">{row.label}</span>
              <span className="flex shrink-0 items-center gap-[6px] text-fx-15 text-secondary">
                {row.value}
                {row.href && <ChevronRight size={18} strokeWidth={1.5} className="rtl:rotate-180" />}
              </span>
            </>
          );
          const cls = "flex min-h-[54px] items-center justify-between gap-[12px] rounded-mini bg-card px-[16px] py-[10px]";
          return row.href ? (
            <Link key={row.key} href={row.href} className={cls}>
              {content}
            </Link>
          ) : (
            <div key={row.key} className={cls}>
              {content}
            </div>
          );
        })}
      </Tile>
    </Card>
  );
}

function KpiCard({ children }: { children: React.ReactNode }) {
  return (
    <Card pad={20} className="min-h-[450px]">
      <div className="grid h-full grid-cols-1 gap-[15px] sm:grid-cols-2 2xl:auto-rows-[197px]">{children}</div>
    </Card>
  );
}

function TableCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} leading="normal" className="min-h-[54px]" />
      <div className="mt-[15px]">{children}</div>
    </Card>
  );
}

const ROW1 = "grid grid-cols-1 gap-[25px] lg:grid-cols-2 2xl:grid-cols-3";

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const role = currentUser?.role ?? "broker";
  const ownClaims = useScopedClaims(role, currentUser?.id ?? "", currentUser?.clientId);
  const [greeting] = useState(() => greetingFor(new Date()));

  if (!currentUser) return null;

  const firstName = currentUser.name.split(" ")[0];
  const iconProps = { size: 20, strokeWidth: 1.5 } as const;

  if (role === "administrator") {
    const attention = needsAttentionClaims(state.claims);
    return (
      <div className="space-y-[25px]">
        <PageHeader title={`${greeting}, ${firstName}`} subtitle="Cross-broker overview — unscoped, every client." />
        <div className={ROW1}>
          <HeroCard
            label="Claims needing attention"
            count={attention.length}
            subline={`${state.claims.length} claims across every broker`}
            attention={sortClaimsByAttention(attention)}
            state={state}
            actions={
              <>
                <Link href="/claims/new" className={buttonClass("primary", "md", "w-full")}>
                  <FilePlus2 {...iconProps} />
                  New Claim
                </Link>
                <Link href="/claims" className={buttonClass("outline", "md", "w-full")}>
                  <List {...iconProps} />
                  All Claims
                </Link>
              </>
            }
          />
          <KpiCard>
            <KpiTile highlight href="/claims" LinkComponent={Link} title="Needing attention" icon={<CircleAlert {...iconProps} />} value={attention.length} footer="Claims needing attention" />
            <KpiTile href="/claims" LinkComponent={Link} title="Late-reported" icon={<Clock {...iconProps} />} value={state.claims.filter((c) => c.lateReported).length} footer="Late-reported claims" />
            <KpiTile href="/clients" LinkComponent={Link} title="Clients" icon={<Users {...iconProps} />} value={state.clients.length} footer="Clients on file" />
            <KpiTile href="/claims" LinkComponent={Link} title="Total claims" icon={<FileText {...iconProps} />} value={state.claims.length} footer="Claims on file" />
          </KpiCard>
          <ListCard
            title="Administration"
            subtitle="Access, configuration and settings"
            empty=""
            rows={[
              { key: "users", label: "Users & Access", value: `${state.users.length} users`, href: "/users" },
              { key: "products", label: "Product & Document Configuration", value: "", href: "/settings/products" },
              { key: "company", label: "Company & Report Settings", value: "", href: "/settings/company" },
            ]}
          />
        </div>
        <TableCard title="Needs Attention">
          <ClaimsTable claims={attention} showBrokerColumn emptyMessage="Nothing currently needs attention." />
        </TableCard>
      </div>
    );
  }

  if (role === "manager") {
    const attention = needsAttentionClaims(state.claims);
    const byBroker = new Map<string, number>();
    attention.forEach((c) => byBroker.set(c.brokerId, (byBroker.get(c.brokerId) ?? 0) + 1));
    return (
      <div className="space-y-[25px]">
        <PageHeader title={`${greeting}, ${firstName}`} subtitle="Portfolio-level exception view, across every Broker." />
        <div className={ROW1}>
          <HeroCard
            label="Claims needing attention"
            count={attention.length}
            subline={`Across ${byBroker.size} ${byBroker.size === 1 ? "broker" : "brokers"}`}
            attention={sortClaimsByAttention(attention)}
            state={state}
            actions={
              <>
                <Link href="/claims" className={buttonClass("primary", "md", "w-full")}>
                  <List {...iconProps} />
                  All Claims
                </Link>
                <Link href="/clients" className={buttonClass("outline", "md", "w-full")}>
                  <Users {...iconProps} />
                  Clients
                </Link>
              </>
            }
          />
          <KpiCard>
            <KpiTile highlight title="Needing attention" icon={<CircleAlert {...iconProps} />} value={attention.length} footer="All brokers" />
            <KpiTile title="Late-reported" icon={<Clock {...iconProps} />} value={state.claims.filter((c) => c.lateReported).length} footer="Late-reported claims" />
            <KpiTile title="Clients" icon={<Users {...iconProps} />} value={state.clients.length} footer="Clients on file" />
            <KpiTile title="Total claims" icon={<FileText {...iconProps} />} value={state.claims.length} footer="Claims on file" />
          </KpiCard>
          <ListCard
            title="Which Broker's queue needs stepping in?"
            subtitle="Claims needing attention, by broker"
            empty="No claims currently need attention."
            rows={[...byBroker.entries()].map(([brokerId, count]) => ({
              key: brokerId,
              label: findUser(state, brokerId)?.name ?? "—",
              value: `${count} needing attention`,
            }))}
          />
        </div>
        <TableCard title="Needs Attention (all brokers)">
          <ClaimsTable claims={attention} showBrokerColumn emptyMessage="Nothing currently needs attention." />
        </TableCard>
      </div>
    );
  }

  // Broker: the dashboard IS the sorted claims queue (§13.3).
  const sorted = sortClaimsByAttention(ownClaims);
  const attention = needsAttentionClaims(ownClaims);
  // eslint-disable-next-line react-hooks/purity -- a dashboard tile snapshotting "now" for a display count is fine outside the compiler
  const lateThisWeek = ownClaims.filter((c) => c.lateReported && Date.now() - new Date(c.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length;
  const clientIds = [...new Set(ownClaims.map((c) => c.clientId))];

  return (
    <div className="space-y-[25px]">
      <PageHeader title={`${greeting}, ${firstName}`} subtitle="Your claims, sorted by what needs action." />
      <div className={ROW1}>
        <HeroCard
          label="Claims need action"
          count={attention.length}
          subline={`${ownClaims.length} claims in your queue`}
          attention={sortClaimsByAttention(attention)}
          state={state}
          actions={
            <>
              <Link href="/claims/new" className={buttonClass("primary", "md", "w-full")}>
                  <FilePlus2 {...iconProps} />
                  New Claim
                </Link>
              <Link href="/claims" className={buttonClass("outline", "md", "w-full")}>
                  <List {...iconProps} />
                  All Claims
                </Link>
            </>
          }
        />
        <KpiCard>
          <KpiTile highlight title="Need action" icon={<CircleAlert {...iconProps} />} value={attention.length} footer="Claims need action" />
          <KpiTile title="Late this week" icon={<Clock {...iconProps} />} value={lateThisWeek} footer="Late-reported this week" />
          <KpiTile title="Clients" icon={<Users {...iconProps} />} value={clientIds.length} footer="Assigned clients" />
          <KpiTile title="My claims" icon={<Layers {...iconProps} />} value={ownClaims.length} footer="In your queue" />
        </KpiCard>
        <ListCard
          title="Assigned Clients"
          subtitle="Your book, by client"
          empty="No clients assigned yet."
          rows={clientIds.map((cid) => {
            const count = ownClaims.filter((c) => c.clientId === cid).length;
            return { key: cid, label: findClient(state, cid)?.name ?? "—", value: `${count} claims`, href: `/clients/${cid}` };
          })}
        />
      </div>
      <TableCard title="My Claims">
        <ClaimsTable claims={sorted} emptyMessage="No claims assigned to you yet." />
      </TableCard>
    </div>
  );
}
