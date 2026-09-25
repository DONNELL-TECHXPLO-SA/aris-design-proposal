"use client";

import ClientStageTracker from "@/components/claims/ClientStageTracker";
import ComponentCard from "@/components/common/ComponentCard";
import Alert from "@/components/ui/alert/Alert";
import { buttonClass } from "@/components/ui/button/Button";
import { RowIcon, StatusDot } from "@/components/ui/finexy";
import { FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { auditFor, checklistFor, clientAttentionFor, documentsFor, formatDateTime } from "@/lib/mock/helpers";
import { clientStageNote } from "@/lib/mock/clientStatus";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";

export default function ClientClaimStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state } = useData();
  if (!claim) return null;

  const documents = documentsFor(state, claim.id);
  const attention = clientAttentionFor(claim, state.documents);
  const timeline = auditFor(state, { claimId: claim.id });
  const checklist = checklistFor(state, claim.id);
  const claimFormStarted = !!claim.claimFormValues && Object.keys(claim.claimFormValues).length > 0;

  return (
    <div className="space-y-[25px]">
      <ComponentCard title="Progress">
        <ClientStageTracker status={claim.status} blocking={clientStageNote(state, claim).blocking} />
        <p className="rounded-tile bg-tile px-[20px] py-[16px] text-fx-17 text-ink">{clientStageNote(state, claim).text}</p>
      </ComponentCard>
      {claim.lateReported && (
        <Alert
          variant="warning"
          title="Late Reported"
          message="This claim was reported more than 30 days after the date of loss, which the Insurer may consider grounds for rejection."
        />
      )}
      {(claim.status === "repudiated" || claim.status === "within_excess" || claim.status === "not_taken_up") && (
        <Alert
          variant="info"
          title="No action needed"
          message={
            claim.status === "repudiated"
              ? "The insurer has repudiated this claim. There is nothing further for you to do here."
              : claim.status === "not_taken_up"
                ? "This claim was withdrawn. There is nothing further for you to do here."
                : "This loss falls within your policy excess, so no payment arises. There is nothing further for you to do here."
          }
        />
      )}
      {attention && <Alert variant="warning" title="Action needed" message={attention} />}

      <ComponentCard title="Claim Form" desc={claimFormStarted ? "In progress — pick up where you or your broker left off." : "Not started yet."}>
        <div className="flex flex-wrap items-center justify-between gap-[13px] rounded-tile bg-tile px-[20px] py-[16px]">
          <StatusDot tone={claimFormStarted ? "yellow" : "muted"}>{claimFormStarted ? "In progress" : "Not started"}</StatusDot>
          <Link href={`/portal/claims/${claim.id}/claim-form`} className={buttonClass("primary", "sm")}>
            {claimFormStarted ? "Continue filling form →" : "Start claim form →"}
          </Link>
        </div>
      </ComponentCard>

      <ComponentCard title="Timeline">
        <ol className="relative space-y-[18px] ps-[24px]">
          <span className="absolute top-[8px] bottom-[8px] start-[3px] w-px bg-line" />
          {timeline.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -start-[24px] top-[8px] size-[7px] rounded-full bg-orange" />
              <p className="text-fx-17 text-ink">{entry.action}</p>
              <p className="text-fx-14 text-secondary">{formatDateTime(entry.createdAt)}</p>
            </li>
          ))}
        </ol>
      </ComponentCard>

      <ComponentCard title="Document Checklist" desc="Advisory only.">
        <ul className="flex flex-col gap-[10px] rounded-tile bg-tile p-[10px]">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-[12px] rounded-mini bg-card px-[16px] py-[12px]">
              <span className="text-fx-17 text-ink">{item.label}</span>
              <StatusDot tone={item.status === "received" ? "green" : "muted"} size={15}>
                {item.status === "received" ? "Received" : "Outstanding"}
              </StatusDot>
            </li>
          ))}
        </ul>
      </ComponentCard>

      {documents.length > 0 && (
        <ComponentCard title="Your Documents">
          <ul className="flex flex-col gap-[4px]">
            {documents.map((doc) => (
              <li key={doc.id} className="flex min-h-[54px] items-center justify-between gap-[12px] rounded-mini px-[12px] hover:bg-tile">
                <span className="flex min-w-0 items-center gap-[12px] text-fx-17 text-ink">
                  <RowIcon>
                    <FileText size={16} strokeWidth={1.5} />
                  </RowIcon>
                  <span className="truncate">{doc.filename}</span>
                </span>
                <span className="shrink-0 text-fx-14 text-secondary">{formatDateTime(doc.uploadedAt)}</span>
              </li>
            ))}
          </ul>
        </ComponentCard>
      )}
    </div>
  );
}
