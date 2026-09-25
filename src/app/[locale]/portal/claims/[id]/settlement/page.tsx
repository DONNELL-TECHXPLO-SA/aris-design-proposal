"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Button, { buttonClass } from "@/components/ui/button/Button";
import { EmptyState, StatusDot } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { documentsFor, formatDateTime } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import type { DocumentType } from "@/lib/mock/types";
import { useParams } from "next/navigation";
import { useState } from "react";

function ClientUploadRow({ label, docType, claimId, existing, buttonLabel }: { label: string; docType: DocumentType; claimId: string; existing?: { filename: string; uploadedAt: string }; buttonLabel: string }) {
  const { currentUser } = useAuth();
  const { uploadDocument } = useData();
  const [file, setFile] = useState<File | null>(null);

  if (existing) {
    return (
      <div className="rounded-tile bg-tile p-[20px]">
        <StatusDot tone="green">{label}</StatusDot>
        <p className="mt-[4px] ps-[15px] text-fx-14 text-secondary">
          {existing.filename} · {formatDateTime(existing.uploadedAt)}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-tile bg-tile p-[20px]">
      <p className="mb-[12px] text-fx-17 font-medium text-ink">{label}</p>
      <div className="flex flex-wrap items-center gap-[13px]">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="min-w-0 flex-1 w-full cursor-pointer overflow-hidden rounded-field border border-line bg-card ps-[6px] py-[6px] text-fx-17 text-secondary outline-none file:me-[14px] file:h-[40px] file:cursor-pointer file:rounded-full file:border-0 file:bg-tile file:px-[18px] file:text-fx-15 file:font-medium file:text-ink hover:file:bg-hover"
        />
        <Button
          size="sm"
          disabled={!file || !currentUser}
          onClick={() => {
            if (!file || !currentUser) return;
            uploadDocument({ claimId, docType, filename: file.name, uploadedById: currentUser.id, actorRole: currentUser.role });
            setFile(null);
          }}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}

export default function ClientClaimSettlementPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state } = useData();
  if (!claim || !claim.decision || claim.decision.outcome !== "settled") return null;

  const documents = documentsFor(state, claim.id);
  const findDoc = (type: DocumentType) => documents.find((d) => d.type === type);
  const isCash = claim.decision.settlementMethod === "cash";

  return (
    <div className="space-y-[25px]">
      {isCash ? (
        <ComponentCard title="Agreement of Loss" desc="Your claim was settled in cash. Download, sign, and upload the Agreement of Loss below.">
          <div className="space-y-[15px]">
            {findDoc("unsigned_aol") ? (
              <div className="flex flex-wrap items-center justify-between gap-[13px] rounded-tile bg-tile p-[20px]">
                <div className="min-w-0">
                  <p className="text-fx-17 font-medium text-ink">Unsigned Agreement of Loss</p>
                  <p className="text-fx-14 text-secondary">{findDoc("unsigned_aol")!.filename}</p>
                </div>
                <a
                  download
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className={buttonClass("primary", "sm")}
                >
                  Download to sign
                </a>
              </div>
            ) : (
              <EmptyState title="Your Broker hasn&apos;t issued the Agreement of Loss yet." />
            )}
            {findDoc("unsigned_aol") && (
              <ClientUploadRow label="Signed Agreement of Loss" docType="signed_aol" claimId={claim.id} existing={findDoc("signed_aol")} buttonLabel="Upload signed AOL" />
            )}
            {findDoc("signed_aol") && (
              <ClientUploadRow label="Proof of Payment (from Insurer)" docType="proof_of_payment" claimId={claim.id} existing={findDoc("proof_of_payment")} buttonLabel="Upload proof of payment" />
            )}
          </div>
        </ComponentCard>
      ) : (
        <ComponentCard title="Excess Invoice" desc="Your claim was settled by repair/replacement. Pay the excess invoice and upload proof of payment below.">
          <div className="space-y-[15px]">
            {findDoc("excess_invoice") ? (
              <div className="rounded-tile bg-tile p-[20px]">
                <p className="text-fx-17 font-medium text-ink">Excess Invoice</p>
                <p className="text-fx-14 text-secondary">{findDoc("excess_invoice")!.filename}</p>
              </div>
            ) : (
              <EmptyState title="Your Broker hasn&apos;t issued the excess invoice yet." />
            )}
            {findDoc("excess_invoice") && (
              <ClientUploadRow label="Proof of Payment (excess)" docType="proof_of_payment" claimId={claim.id} existing={findDoc("proof_of_payment")} buttonLabel="Upload proof of payment" />
            )}
          </div>
        </ComponentCard>
      )}
    </div>
  );
}
