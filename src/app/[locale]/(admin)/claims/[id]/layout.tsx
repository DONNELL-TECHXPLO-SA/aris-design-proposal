"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NotFoundPanel from "@/components/common/NotFoundPanel";
import StatusBadge from "@/components/claims/StatusBadge";
import Tabs from "@/components/ui/tabs/Tabs";
import { AlertIcon } from "@/icons";
import { findClient, findSection, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";

export default function ClaimDetailLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { claim, notFound } = useClaimAccess(id);
  const { state } = useData();
  const pathname = usePathname();

  if (notFound || !claim) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Claim" />
        <NotFoundPanel backHref="/claims" />
      </div>
    );
  }

  const client = findClient(state, claim.clientId);
  const section = findSection(state, claim.sectionId);
  const base = `/claims/${claim.id}`;

  const tabs = [
    { key: "overview", label: "Overview", href: base },
    { key: "claim-form", label: "Claim Form", href: `${base}/claim-form` },
    { key: "documents", label: "Documents", href: `${base}/documents` },
    { key: "insurer-assessor", label: "Insurer & Assessor", href: `${base}/insurer-assessor` },
    { key: "decision", label: "Decision & Settlement", href: `${base}/decision` },
    { key: "financials", label: "Financials", href: `${base}/financials` },
    { key: "communication", label: "Communication", href: `${base}/communication` },
    { key: "comments", label: "Comments", href: `${base}/comments` },
    { key: "activity", label: "Activity", href: `${base}/activity` },
  ];
  const active =
    [...tabs]
      .sort((a, b) => b.href.length - a.href.length)
      .find((t) => pathname === t.href || pathname.startsWith(`${t.href}/`))?.key ?? "overview";

  return (
    <div>
      <PageBreadcrumb pageTitle={claim.reference} />

      <div className="mb-[25px] rounded-card bg-card p-[20px] md:p-[25px]">
        <div className="flex flex-wrap items-start justify-between gap-[16px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-[12px]">
              <h1 className="tabular-numbers text-fx-24 leading-tight font-medium text-ink">{claim.reference}</h1>
              {claim.lateReported && (
                <span className="inline-flex items-center gap-[6px] rounded-full bg-tile px-[12px] py-[4px] text-fx-15 text-ink">
                  <AlertIcon size={16} className="text-orange" /> Late Reported
                </span>
              )}
            </div>
            <p className="mt-[6px] text-fx-17 text-secondary">
              {client?.name} · {claim.claimType} · {section?.insurer} · Loss on {formatDate(claim.dateOfLoss)}
            </p>
          </div>
          <div className="flex h-[44px] items-center rounded-full bg-tile px-[18px]">
            <StatusBadge status={claim.status} />
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} active={active} className="mb-[25px]" />

      {children}
    </div>
  );
}
