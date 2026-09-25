"use client";

import ClientStatusPill from "@/components/claims/ClientStatusPill";
import { initialsOf } from "@/components/header/ClientUserMenu";
import { buttonClass } from "@/components/ui/button/Button";
import { Card, CardHeader, EmptyState, PageHeader } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { MailIcon } from "@/icons";
import { clientClaimTitle } from "@/lib/mock/clientStatus";
import { findClient, findUser } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";

// The org's assigned Broker, and a shortcut into each open claim's message thread —
// messages sent there are kept on the claim record for both sides.
export default function ClientContactBrokerPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const claims = useScopedClaims(currentUser?.role ?? "client_primary", currentUser?.id ?? "", currentUser?.clientId);
  if (!currentUser) return null;

  const org = findClient(state, currentUser.clientId);
  const broker = findUser(state, org?.brokerId);
  const openClaims = claims.filter((c) => c.status !== "closed").sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-[25px]">
      <PageHeader title="Contact Broker" subtitle={<>Your dedicated broker at {state.companySettings.companyName}</>} />

      {broker && (
        <Card className="flex flex-wrap items-center gap-[16px]">
          <span className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-dark text-fx-17 font-semibold text-on-dark">
            {initialsOf(broker.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-fx-20 leading-tight font-medium text-ink">{broker.name}</p>
            <p className="mt-[4px] text-fx-15 text-secondary">Claims broker · {org?.name}</p>
          </div>
          <a href={`mailto:${broker.email}`} className={buttonClass("outline", "sm")}>
            <MailIcon size={20} /> {broker.email}
          </a>
        </Card>
      )}

      <Card>
        <CardHeader title="Message about a claim" />
        <div className="mt-[20px]">
          {openClaims.length === 0 ? (
            <EmptyState title="You have no open claims." />
          ) : (
            <ul className="flex flex-col gap-[10px] rounded-tile bg-tile p-[10px]">
              {openClaims.map((claim) => (
                <li key={claim.id}>
                  <Link
                    href={`/portal/claims/${claim.id}/communication`}
                    className="flex items-center gap-[16px] rounded-mini bg-card px-[16px] py-[12px] hover:bg-hover"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-fx-17 text-ink">{clientClaimTitle(state, claim)}</p>
                      <p className="text-fx-14 text-secondary">{claim.reference}</p>
                    </div>
                    <ClientStatusPill status={claim.status} />
                    <span className="hidden text-fx-15 font-medium text-ink sm:inline">Message →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
