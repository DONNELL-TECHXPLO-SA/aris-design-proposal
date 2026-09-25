"use client";

import NotFoundPanel from "@/components/common/NotFoundPanel";
import ClientStatusPill from "@/components/claims/ClientStatusPill";
import Tabs from "@/components/ui/tabs/Tabs";
import { Link, usePathname } from "@/i18n/navigation";
import { AlertIcon, ChevronLeftIcon } from "@/icons";
import { findSection, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";

// Client Claim Detail — a single scrolling record with light sub-nav (not full admin
// tabs), per ux-blueprint.md §8.2/§10.3/§20.2's shallow-app, mobile-first framing.
export default function ClientClaimDetailLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { claim, notFound } = useClaimAccess(id);
  const { state } = useData();
  const pathname = usePathname();

  if (notFound || !claim) {
    return <NotFoundPanel backHref="/portal" backLabel="Back to My Claims" />;
  }

  const section = findSection(state, claim.sectionId);
  const base = `/portal/claims/${claim.id}`;
  const showSettlement = claim.decision?.outcome === "settled";

  const tabs = [
    { key: "status", label: "Status & Timeline", href: base },
    { key: "claim-form", label: "Claim Form", href: `${base}/claim-form` },
    { key: "documents", label: "Documents", href: `${base}/documents` },
    { key: "communication", label: "Communication", href: `${base}/communication` },
    { key: "comment", label: "Comment", href: `${base}/comment` },
    ...(showSettlement ? [{ key: "settlement", label: "Settlement", href: `${base}/settlement` }] : []),
  ];
  const active =
    [...tabs]
      .sort((a, b) => b.href.length - a.href.length)
      .find((t) => pathname === t.href || pathname.startsWith(`${t.href}/`))?.key ?? "status";

  return (
    <div>
      <Link href="/portal" className="mb-[20px] inline-flex items-center gap-[6px] text-fx-17 text-secondary hover:text-ink">
        <ChevronLeftIcon size={20} className="rtl:rotate-180" /> My Claims
      </Link>

      <div className="mb-[25px] rounded-card bg-card p-[20px] md:p-[25px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="text-fx-32 leading-tight font-[500] tracking-[-0.02em] text-ink md:text-fx-38">{claim.reference}</h1>
          <ClientStatusPill status={claim.status} />
          {claim.lateReported && (
            <span className="inline-flex items-center gap-[6px] rounded-full bg-tile px-[12px] py-[4px] text-fx-15 text-ink">
              <AlertIcon size={16} className="text-orange" /> Late reported
            </span>
          )}
        </div>
        <p className="mt-[10px] text-fx-17 text-secondary">
          {claim.claimType} · {section?.insurer} · Loss on {formatDate(claim.dateOfLoss)}
        </p>
      </div>
      <Tabs tabs={tabs} active={active} className="mb-[25px]" />

      {children}
    </div>
  );
}
