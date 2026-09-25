"use client";

import ClientStageTracker from "@/components/claims/ClientStageTracker";
import ClientStatusPill from "@/components/claims/ClientStatusPill";
import { buttonClass } from "@/components/ui/button/Button";
import { Link } from "@/i18n/navigation";
import { AlertIcon, ChevronDownIcon, InfoIcon, LockIcon } from "@/icons";
import { clientClaimTitle, clientStageNote, clientStageOf } from "@/lib/mock/clientStatus";
import { findSection, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Claim } from "@/lib/mock/types";
import { cn } from "@/utils";
import { useId } from "react";

interface ClientClaimCardProps {
  claim: Claim;
  expanded: boolean;
  onToggle: () => void;
}

// One claim in the User Portal's My Claims list (UC-03). Collapsed it's a single row —
// title and reference on the left, client-facing status on the right. Expanded it adds
// the 5-stage tracker and a plain-language line on what's happening or what's needed.
// Status is read-only here: it always reflects the Broker's latest update.
export default function ClientClaimCard({ claim, expanded, onToggle }: ClientClaimCardProps) {
  const { state } = useData();
  const panelId = useId();
  const title = clientClaimTitle(state, claim);
  const stage = clientStageOf(claim.status);
  const finalised = stage === "finalised";
  const note = clientStageNote(state, claim);
  const section = findSection(state, claim.sectionId);
  const base = `/portal/claims/${claim.id}`;

  return (
    <article className="rounded-card bg-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="flex w-full items-center gap-[16px] p-[20px] text-start md:px-[25px]"
      >
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[10px] sm:flex-row sm:items-center sm:justify-between sm:gap-[16px]">
          <div className="max-w-full min-w-0">
            <h2 className={cn("text-fx-20 leading-tight font-medium sm:truncate", finalised ? "text-secondary" : "text-ink")}>
              {title}
            </h2>
            <p className="mt-[4px] text-fx-15 text-secondary">
              <span className="text-ink">{claim.reference}</span> · Lodged {formatDate(claim.createdAt)}
            </p>
          </div>
          <ClientStatusPill status={claim.status} />
        </div>
        <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-tile text-ink">
          <ChevronDownIcon size={20} className={cn("transition-transform", expanded && "rotate-180")} aria-hidden />
        </span>
      </button>

      {expanded && (
        <div id={panelId} className="px-[20px] pb-[20px] md:px-[25px] md:pb-[25px]">
          <div className="rounded-tile bg-tile p-[20px]">
            <ClientStageTracker status={claim.status} blocking={note.blocking} />

            <p className="mt-[20px] flex items-start gap-[12px] rounded-mini bg-card px-[16px] py-[12px] text-fx-15 text-ink">
              {note.blocking ? (
                <AlertIcon size={20} className="mt-[1px] shrink-0 text-yellow" aria-hidden />
              ) : finalised ? (
                <LockIcon size={20} className="mt-[1px] shrink-0 text-muted" aria-hidden />
              ) : (
                <InfoIcon size={20} className="mt-[1px] shrink-0 text-muted" aria-hidden />
              )}
              <span>{note.text}</span>
            </p>
          </div>

          <div className="mt-[20px] flex flex-wrap items-center justify-between gap-[13px]">
            <p className="text-fx-15 text-secondary">
              {section?.name} · {section?.insurer} · Updated {formatDate(claim.updatedAt)}
            </p>
            <div className="flex flex-wrap items-center gap-[13px]">
              {stage === "documents_outstanding" && note.blocking && (
                <Link href={`${base}/documents`} className={buttonClass("primary", "sm")}>
                  Upload documents
                </Link>
              )}
              <Link href={base} className={buttonClass("outline", "sm")}>
                {finalised ? "View claim (read-only)" : "View claim details"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
