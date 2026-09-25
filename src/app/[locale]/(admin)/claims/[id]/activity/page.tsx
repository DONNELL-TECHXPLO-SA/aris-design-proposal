"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { findUser, formatDateTime, auditFor } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";

export default function ClaimActivityPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state } = useData();
  if (!claim) return null;

  const entries = auditFor(state, { claimId: claim.id });

  return (
    <ComponentCard title="Activity" desc="Immutable, timestamped record of every material action on this claim.">
      <ol className="relative space-y-[20px] rounded-tile bg-tile p-[20px] ps-[44px]">
        <span className="absolute top-[28px] bottom-[28px] start-[23px] w-px bg-line" />
        {entries.map((entry) => {
          const actor = findUser(state, entry.actorId);
          return (
            <li key={entry.id} className="relative">
              <span className="absolute -start-[24px] top-[8px] size-[7px] rounded-full bg-orange" />
              <p className="text-fx-17 text-ink">{entry.action}</p>
              <p className="mt-[2px] text-fx-14 text-secondary">
                {actor?.name ?? (entry.actorId === "system" ? "System" : entry.actorId)} · {formatDateTime(entry.createdAt)}
              </p>
            </li>
          );
        })}
      </ol>
    </ComponentCard>
  );
}
