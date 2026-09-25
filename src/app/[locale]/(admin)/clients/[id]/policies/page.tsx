"use client";

import { buttonClass } from "@/components/ui/button/Button";
import { Card, CardHeader, EmptyState, PaymentCard, Tile } from "@/components/ui/finexy";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "@/icons";
import { formatCurrency, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";

// Finexy "My Cards" pattern: icon-circle header with the add actions as grey pills, a
// row of 315×198 cards (dark / orange) clipped by the card edge — one per policy — and
// each policy's sections and assets below in grey tiles.
export default function ClientPoliciesPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useData();
  const policies = state.policies.filter((p) => p.clientId === id);

  return (
    <div className="space-y-[25px]">
      <Card className="overflow-hidden">
        <CardHeader
          size="card"
          icon={<ShieldCheck size={22} strokeWidth={1.5} />}
          title="Policies"
          actions={
            <>
              <Link href={`/clients/${id}/assets/new`} className={buttonClass("outline", "sm")}>
                <PlusIcon size={18} />
                New Asset
              </Link>
              <Link href={`/clients/${id}/policies/new`} className={buttonClass("outline", "sm")}>
                <PlusIcon size={18} />
                New Policy
              </Link>
            </>
          }
        />

        {policies.length === 0 ? (
          <EmptyState className="mt-[22px]" title="No policies on file for this client yet." />
        ) : (
          <div className="no-scrollbar -me-[25px] mt-[22px] flex gap-[16px] overflow-x-auto pe-[25px]">
            {policies.map((policy, i) => (
              <PaymentCard key={policy.id} tone={i % 2 === 0 ? "dark" : "orange"} chip={`${policy.sections.length} ${policy.sections.length === 1 ? "section" : "sections"}`}>
                <div>
                  <div className="text-fx-11 font-normal text-white/70">Policy Number</div>
                  <div className="mt-[2px] truncate text-fx-14 font-medium tracking-wider text-white">{policy.policyNumber}</div>
                </div>
                <div className="mt-[12px]">
                  <div className="text-fx-11 font-normal text-white/70">Period</div>
                  <div className="mt-[2px] text-fx-14 font-medium text-white">
                    {formatDate(policy.periodStart)} — {formatDate(policy.periodEnd)}
                  </div>
                </div>
              </PaymentCard>
            ))}
          </div>
        )}
      </Card>

      {policies.map((policy) => (
        <Card key={policy.id}>
          <CardHeader size="card" title={policy.policyNumber} subtitle={`${formatDate(policy.periodStart)} — ${formatDate(policy.periodEnd)}`} />
          <div className="mt-[20px] space-y-[15px]">
            {policy.sections.map((section) => {
              const assets = state.assets.filter((a) => a.sectionId === section.id);
              return (
                <Tile key={section.id}>
                  <div className="flex flex-wrap items-center justify-between gap-[10px]">
                    <p className="text-fx-17 font-medium text-ink">
                      {section.name} — {section.insurer}
                    </p>
                    <p className="tabular-numbers text-fx-15 text-secondary">Excess {formatCurrency(section.excess)}</p>
                  </div>
                  {section.requiresAsset && (
                    <ul className="mt-[12px] flex flex-wrap gap-[10px]">
                      {assets.length === 0 ? (
                        <li className="text-fx-15 text-secondary">No assets registered.</li>
                      ) : (
                        assets.map((a) => (
                          <li key={a.id} className="rounded-mini bg-card px-[14px] py-[8px] text-fx-15 text-ink">
                            {a.description}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </Tile>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
