"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { EmptyState } from "@/components/ui/finexy";
import { auditFor, findUser, formatDateTime } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useParams } from "next/navigation";

export default function ClientActivityPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useData();
  const entries = auditFor(state, { clientId: id });

  return (
    <ComponentCard title="Activity">
      {entries.length === 0 ? (
        <EmptyState title="No activity recorded yet." />
      ) : (
        <ul className="space-y-[4px]">
          {entries.map((entry) => {
            const actor = findUser(state, entry.actorId);
            return (
              <li key={entry.id} className="flex gap-[14px] rounded-mini px-[6px] py-[10px]">
                <span className="mt-[9px] size-[7px] shrink-0 rounded-full bg-orange" />
                <div className="min-w-0">
                <p className="text-fx-17 text-ink">{entry.action}</p>
                <p className="mt-[2px] text-fx-14 text-secondary">
                  {actor?.name ?? (entry.actorId === "system" ? "System" : entry.actorId)} · {formatDateTime(entry.createdAt)}
                </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ComponentCard>
  );
}
