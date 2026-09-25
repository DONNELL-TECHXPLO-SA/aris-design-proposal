"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EmptyState, RowIcon, StatusDot } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { DownloadIcon, FileIcon } from "@/icons";
import { checklistFor, documentsFor, formatDateTime } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import type { DocumentType } from "@/lib/mock/types";
import { useParams } from "next/navigation";
import { useState } from "react";

const DOC_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: "photo", label: "Photograph" },
  { value: "police_report", label: "Police Report" },
  { value: "incident_report", label: "Incident Report" },
  { value: "unsigned_aol", label: "Unsigned Agreement of Loss" },
  { value: "signed_aol", label: "Signed Agreement of Loss" },
  { value: "proof_of_payment", label: "Proof of Payment" },
  { value: "excess_invoice", label: "Excess Invoice" },
  { value: "repudiation_letter", label: "Repudiation Letter" },
  { value: "policy_schedule", label: "Policy Schedule" },
  { value: "other", label: "Other" },
];

export default function ClaimDocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state, uploadDocument, markChecklistReceived } = useData();
  const { currentUser } = useAuth();
  const [checklistItemId, setChecklistItemId] = useState("");
  const [docType, setDocType] = useState<DocumentType>("other");
  const [file, setFile] = useState<File | null>(null);

  if (!claim || !currentUser) return null;

  const checklist = checklistFor(state, claim.id);
  const documents = documentsFor(state, claim.id);

  function handleUpload() {
    if (!file) return;
    uploadDocument({
      claimId: claim!.id,
      docType,
      filename: file.name,
      uploadedById: currentUser!.id,
      actorRole: currentUser!.role,
      checklistItemId: checklistItemId || undefined,
    });
    setFile(null);
    setChecklistItemId("");
  }

  return (
    <div className="grid grid-cols-1 items-start gap-[25px] lg:grid-cols-3">
      <div className="space-y-[25px] lg:col-span-2">
        <ComponentCard title="Checklist" desc="Advisory — never blocks anything else on the claim.">
          <ul className="space-y-[10px] rounded-tile bg-tile p-[20px]">
            {checklist.map((item) => (
              <li key={item.id} className="flex min-h-[64px] items-center justify-between gap-[12px] rounded-mini bg-card px-[16px] py-[10px]">
                <span className="text-fx-17 text-ink">{item.label}</span>
                {item.status === "received" ? (
                  <StatusDot tone="green" size={15}>Received</StatusDot>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => markChecklistReceived({ claimId: claim.id, checklistItemId: item.id, actorId: currentUser.id, actorRole: currentUser.role })}>
                    Mark received
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </ComponentCard>

        <ComponentCard title="All Documents">
          {documents.length === 0 ? (
            <EmptyState title="No documents uploaded yet." />
          ) : (
            <ul className="space-y-[10px] rounded-tile bg-tile p-[20px]">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-[12px] rounded-mini bg-card px-[16px] py-[12px]">
                  <div className="flex min-w-0 items-center gap-[12px]">
                    <RowIcon>
                      <FileIcon size={16} />
                    </RowIcon>
                    <div className="min-w-0">
                      <p className="truncate text-fx-17 text-ink">{doc.filename}</p>
                      <p className="text-fx-14 text-secondary">
                        {DOC_TYPE_OPTIONS.find((o) => o.value === doc.type)?.label ?? doc.type} · {formatDateTime(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <DownloadIcon size={20} className="shrink-0 text-muted" />
                </li>
              ))}
            </ul>
          )}
        </ComponentCard>
      </div>

      <ComponentCard title="Upload Document">
        <div className="space-y-[20px]">
          <div>
            <Label>Document type</Label>
            <Select
              options={DOC_TYPE_OPTIONS}
              defaultValue={docType}
              onChange={(v) => setDocType(v as DocumentType)}
            />
          </div>
          <div>
            <Label>Satisfies checklist item (optional)</Label>
            <Select
              options={[{ value: "", label: "Ad-hoc — not on the checklist" }, ...checklist.filter((c) => c.status === "outstanding").map((c) => ({ value: c.id, label: c.label }))]}
              defaultValue=""
              onChange={setChecklistItemId}
            />
          </div>
          <div>
            <Label>File</Label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block h-[54px] w-full cursor-pointer rounded-field border border-line bg-card ps-[6px] text-fx-15 text-secondary file:me-[14px] file:mt-[6px] file:h-[40px] file:cursor-pointer file:rounded-full file:border-0 file:bg-tile file:px-[18px] file:text-fx-15 file:font-medium file:text-ink hover:file:bg-hover"
            />
          </div>
          <Button className="w-full" disabled={!file} onClick={handleUpload}>
            Upload
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
}
