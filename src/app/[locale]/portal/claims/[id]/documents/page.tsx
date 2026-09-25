"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { EmptyState, RowIcon, StatusDot } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { FileIcon } from "@/icons";
import { checklistFor, documentsFor, formatDateTime } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ClientClaimDocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state, uploadDocument } = useData();
  const { currentUser } = useAuth();
  const [checklistItemId, setChecklistItemId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!claim || !currentUser) return null;

  const checklist = checklistFor(state, claim.id);
  const documents = documentsFor(state, claim.id);
  const outstanding = checklist.filter((c) => c.status === "outstanding");
  const canUpload = claim.status !== "closed";

  return (
    <div className="space-y-[25px]">
      <ComponentCard title="Checklist">
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

      <ComponentCard title="Your Documents">
        {documents.length === 0 ? (
          <EmptyState title="No documents uploaded yet." />
        ) : (
          <ul className="flex flex-col gap-[4px]">
            {documents.map((doc) => (
              <li key={doc.id} className="flex min-h-[63px] items-center gap-[12px] rounded-mini px-[12px] py-[10px] hover:bg-tile">
                <RowIcon>
                  <FileIcon size={16} />
                </RowIcon>
                <div className="min-w-0">
                  <p className="truncate text-fx-17 text-ink">{doc.filename}</p>
                  <p className="text-fx-14 text-secondary">{formatDateTime(doc.uploadedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ComponentCard>

      {canUpload && (
        <ComponentCard title="Upload a Document">
          <div className="space-y-[20px]">
            <Select
              options={[{ value: "", label: "Ad-hoc — not on the checklist" }, ...outstanding.map((c) => ({ value: c.id, label: c.label }))]}
              defaultValue=""
              onChange={setChecklistItemId}
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full cursor-pointer overflow-hidden rounded-field border border-line bg-card ps-[6px] py-[6px] text-fx-17 text-secondary outline-none file:me-[14px] file:h-[40px] file:cursor-pointer file:rounded-full file:border-0 file:bg-tile file:px-[18px] file:text-fx-15 file:font-medium file:text-ink hover:file:bg-hover"
            />
            <Button
              className="w-full"
              disabled={!file}
              onClick={() => {
                if (!file) return;
                uploadDocument({ claimId: claim.id, docType: "other", filename: file.name, uploadedById: currentUser.id, actorRole: currentUser.role, checklistItemId: checklistItemId || undefined });
                setFile(null);
              }}
            >
              Upload
            </Button>
          </div>
        </ComponentCard>
      )}
    </div>
  );
}
