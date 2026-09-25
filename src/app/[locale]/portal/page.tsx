"use client";

import ClientClaimCard from "@/components/claims/ClientClaimCard";
import { buttonClass } from "@/components/ui/button/Button";
import { Card, EmptyState, PageHeader } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "@/icons";
import { clientStageNote, clientStageOf } from "@/lib/mock/clientStatus";
import { findClient } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";
import type { Claim, MockState } from "@/lib/mock/types";
import { useState } from "react";

// The claim the client most needs to act on — opened by default so the full stage view
// is visible on arrival. Outstanding documents win; then any other claim waiting on the
// client; otherwise nothing is expanded.
function mostActionableClaim(state: MockState, claims: Claim[]): Claim | undefined {
  const blocking = claims.filter((c) => clientStageNote(state, c).blocking);
  return blocking.find((c) => clientStageOf(c.status) === "documents_outstanding") ?? blocking[0];
}

// User Portal home — UC-03 Track Claim Status. The org's claims, most recently lodged
// first, each showing the client-facing status the Broker last set. Only claims linked
// to the signed-in user's own organisation are ever listed (useScopedClaims).
export default function ClientDashboardPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const claims = useScopedClaims(currentUser?.role ?? "client_primary", currentUser?.id ?? "", currentUser?.clientId);
  // null until the user toggles a card — until then the most actionable claim stays open.
  const [expanded, setExpanded] = useState<Set<string> | null>(null);

  if (!currentUser) return null;

  const org = findClient(state, currentUser.clientId);
  const sorted = [...claims].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const defaultOpen = mostActionableClaim(state, sorted);
  const openIds = expanded ?? new Set(defaultOpen ? [defaultOpen.id] : []);

  const toggle = (id: string) => {
    const next = new Set(openIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  return (
    <div>
      <PageHeader
        title="My Claims"
        subtitle={
          <>
            {org?.name} · {claims.length} {claims.length === 1 ? "claim" : "claims"} on file
          </>
        }
        actions={
          <Link href="/portal/claims/new" className={buttonClass("primary", "md")}>
            <PlusIcon size={20} />
            Lodge a Claim
          </Link>
        }
      />

      {claims.length === 0 ? (
        <Card>
          <EmptyState
            title="No claims yet"
            description="When you need to report a loss, lodging your first claim only takes a few minutes."
            action={
              <Link href="/portal/claims/new" className={buttonClass("primary", "sm")}>
                Lodge your first claim
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-[25px]">
          {sorted.map((claim) => (
            <ClientClaimCard key={claim.id} claim={claim} expanded={openIds.has(claim.id)} onToggle={() => toggle(claim.id)} />
          ))}
        </div>
      )}

      <p className="mt-[25px] text-center text-fx-15 text-secondary">
        Statuses are updated by your broker as your claim progresses.{" "}
        <Link href="/portal/contact" className="font-medium text-ink underline decoration-sep underline-offset-4 hover:decoration-ink">
          Questions? Contact your broker
        </Link>
      </p>
    </div>
  );
}
