"use client";

import ClaimProgress from "@/components/claims/ClaimProgress";
import ComponentCard from "@/components/common/ComponentCard";
import TextArea from "@/components/form/input/TextArea";
import Alert from "@/components/ui/alert/Alert";
import Button, { buttonClass } from "@/components/ui/button/Button";
import { InfoGrid, ProgressBar, StatusDot, Tile } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { checklistFor, findAsset, findClient, findPolicy, findSection, findUser, formatDate, formatDateTime } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ClaimOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state, updateLateMotivation } = useData();
  const { currentUser } = useAuth();
  const [motivation, setMotivation] = useState(claim?.lateReportedMotivation ?? "");
  if (!claim || !currentUser) return null;

  const client = findClient(state, claim.clientId);
  const policy = findPolicy(state, claim.policyId);
  const section = findSection(state, claim.sectionId);
  const asset = findAsset(state, claim.assetId);
  const lodgedBy = findUser(state, claim.lodgedById);
  const broker = findUser(state, claim.brokerId);
  const checklist = checklistFor(state, claim.id);
  const outstanding = checklist.filter((c) => c.status === "outstanding");
  const claimFormStarted = !!claim.claimFormValues && Object.keys(claim.claimFormValues).length > 0;

  const received = checklist.length - outstanding.length;
  const linkClass = "text-fx-17 font-medium text-ink underline decoration-sep underline-offset-4 hover:decoration-ink";

  return (
    <div>
      <ClaimProgress claim={claim} />
      <div className="mt-[25px] grid grid-cols-1 gap-[25px] lg:grid-cols-3">
        <div className="space-y-[25px] lg:col-span-2">
          {claim.lateReported && (
            <ComponentCard title="Late Reported" desc="The Insurer may reject this claim on this basis (UC-11) — record why, for the file.">
              <div className="space-y-[15px]">
                <TextArea rows={2} value={motivation} onChange={setMotivation} placeholder="Why was this claim reported more than 30 days after the date of loss?" />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!motivation.trim() || motivation.trim() === claim.lateReportedMotivation}
                  onClick={() => updateLateMotivation({ claimId: claim.id, motivation: motivation.trim(), actorId: currentUser.id, actorRole: currentUser.role })}
                >
                  Save Motivation
                </Button>
              </div>
            </ComponentCard>
          )}
          {(claim.status === "repudiated" || claim.status === "within_excess" || claim.status === "not_taken_up") && (
            <Alert
              variant="info"
              title="No action needed from the client"
              message={
                claim.status === "repudiated"
                  ? "The claim was repudiated by the insurer. The client has been notified; no further client action is required on this claim."
                  : claim.status === "not_taken_up"
                    ? "The client elected not to proceed with this claim. No further action is required."
                    : "The loss falls within the policy excess and no payment arises. The client has been notified; no further action is required."
              }
            />
          )}
          {claim.status === "disputed" && (
            <Alert variant="warning" title="Disputed" message="This claim has been flagged as disputed — see Decision & Settlement for details." />
          )}

          <ComponentCard title="Claim Form" desc={claimFormStarted ? "In progress — the client or broker can pick up where it was left off." : "Not started yet."}>
            <Tile className="flex flex-wrap items-center justify-between gap-[12px]">
              <StatusDot tone={claimFormStarted ? "yellow" : "muted"}>{claimFormStarted ? "In progress" : "Not started"}</StatusDot>
              <Link href={`/claims/${claim.id}/claim-form`} className={linkClass}>
                {claimFormStarted ? "Continue filling form →" : "Open claim form →"}
              </Link>
            </Tile>
          </ComponentCard>

          <ComponentCard title="Loss Details">
            <Tile>
              <InfoGrid
                items={[
                  { label: "Date of Loss", value: formatDate(claim.dateOfLoss) },
                  { label: "Location", value: claim.location },
                ]}
              />
              <InfoGrid className="mt-[16px]" columns={1} items={[{ label: "Narrative", value: claim.narrative }]} />
            </Tile>
          </ComponentCard>

          <ComponentCard title="Policy &amp; Cover">
            <Tile>
              <InfoGrid
                items={[
                  { label: "Policy", value: policy?.policyNumber },
                  {
                    label: "Section",
                    value: (
                      <>
                        {section?.name} — {section?.insurer}
                      </>
                    ),
                  },
                ]}
              />
              {asset && <InfoGrid className="mt-[16px]" columns={1} items={[{ label: "Asset", value: asset.description }]} />}
            </Tile>
          </ComponentCard>

          <ComponentCard title="Document Checklist" desc="Advisory — an outstanding item never blocks other actions on this claim.">
            {checklist.length > 0 && (
              <div>
                <ProgressBar value={received} max={checklist.length} label="Documents received" />
                <div className="mt-[12px] flex items-center justify-between">
                  <div className="flex items-baseline gap-[6px]">
                    <span className="tabular-numbers text-fx-15 leading-none font-[500] text-ink">{received}</span>
                    <span className="text-fx-13 text-secondary">received out of</span>
                  </div>
                  <span className="tabular-numbers text-fx-15 leading-none font-[500] text-ink">{checklist.length}</span>
                </div>
              </div>
            )}
            <Tile className="space-y-[10px]">
              {checklist.map((item) => (
                <div key={item.id} className="flex min-h-[54px] items-center justify-between gap-[12px] rounded-mini bg-card px-[16px] py-[10px]">
                  <span className="text-fx-17 text-ink">{item.label}</span>
                  <StatusDot tone={item.status === "received" ? "green" : "muted"} size={15}>
                    {item.status === "received" ? "Received" : "Outstanding"}
                  </StatusDot>
                </div>
              ))}
            </Tile>
            <Link href={`/claims/${claim.id}/documents`} className={buttonClass("outline", "sm")}>
              Manage documents →
            </Link>
          </ComponentCard>
        </div>

        <div className="space-y-[25px]">
          <ComponentCard title="Lodgement">
            <Tile>
              <InfoGrid
                columns={1}
                items={[
                  { label: "Client", value: client?.name },
                  { label: "Channel", value: claim.lodgementChannel === "self_service" ? "Client self-service" : "Broker-assisted" },
                  { label: "Lodged by", value: lodgedBy?.name },
                  { label: "Assigned Broker", value: broker?.name },
                  { label: "Lodged", value: formatDateTime(claim.createdAt) },
                ]}
              />
            </Tile>
          </ComponentCard>

          {outstanding.length > 0 && (
            <ComponentCard title="Needs Attention">
              <Tile className="space-y-[12px]">
                {outstanding.map((item) => (
                  <StatusDot key={item.id} tone="yellow" size={15} className="flex">
                    {item.label}
                  </StatusDot>
                ))}
              </Tile>
            </ComponentCard>
          )}
        </div>
      </div>
    </div>
  );
}
