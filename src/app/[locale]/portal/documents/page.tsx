"use client";

import { buttonClass } from "@/components/ui/button/Button";
import { Card, CardHeader, EmptyState, PageHeader, RowIcon } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { AlertIcon, FileIcon } from "@/icons";
import { clientClaimTitle } from "@/lib/mock/clientStatus";
import { findUser, formatDate } from "@/lib/mock/helpers";
import { useData, useScopedClaims } from "@/lib/mock/store";

// Every document on the org's claims in one place, with anything the Broker is still
// waiting on pinned at the top. Uploading happens on each claim's Documents tab.
export default function ClientDocumentsPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const claims = useScopedClaims(currentUser?.role ?? "client_primary", currentUser?.id ?? "", currentUser?.clientId);
  if (!currentUser) return null;

  const claimIds = new Set(claims.map((c) => c.id));
  const byId = new Map(claims.map((c) => [c.id, c]));
  const outstanding = state.checklistItems.filter((i) => claimIds.has(i.claimId) && i.status === "outstanding" && byId.get(i.claimId)?.status !== "closed");
  const documents = state.documents.filter((d) => claimIds.has(d.claimId)).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  return (
    <div className="space-y-[25px]">
      <PageHeader
        title="Documents"
        subtitle={
          <>
            {documents.length} {documents.length === 1 ? "file" : "files"} across your claims
          </>
        }
       
      />

      {outstanding.length > 0 && (
        <Card>
          <CardHeader
            title="Still needed from you"
            size="card"
            icon={<AlertIcon size={22} className="text-yellow" />}
          />
          <ul className="mt-[20px] flex flex-col gap-[10px] rounded-tile bg-tile p-[10px]">
            {outstanding.map((item) => {
              const claim = byId.get(item.claimId)!;
              return (
                <li key={item.id} className="flex items-center justify-between gap-[16px] rounded-mini bg-card px-[16px] py-[12px]">
                  <div className="min-w-0">
                    <p className="text-fx-17 text-ink">{item.label}</p>
                    <p className="truncate text-fx-14 text-secondary">
                      {claim.reference} · {clientClaimTitle(state, claim)}
                    </p>
                  </div>
                  <Link href={`/portal/claims/${claim.id}/documents`} className={buttonClass("primary", "sm")}>
                    Upload
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <Card>
        {documents.length === 0 ? (
          <EmptyState title="No documents yet." />
        ) : (
          <ul className="flex flex-col gap-[4px]">
            {documents.map((doc) => {
              const claim = byId.get(doc.claimId)!;
              const uploader = findUser(state, doc.uploadedById);
              return (
                <li key={doc.id}>
                  <Link
                    href={`/portal/claims/${claim.id}/documents`}
                    className="flex min-h-[63px] items-center gap-[12px] rounded-mini px-[12px] py-[10px] hover:bg-tile"
                  >
                    <RowIcon>
                      <FileIcon size={16} />
                    </RowIcon>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-fx-17 text-ink">{doc.filename}</p>
                      <p className="truncate text-fx-14 text-secondary">
                        {claim.reference} · {clientClaimTitle(state, claim)}
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-end sm:block">
                      <p className="text-fx-15 text-ink">{formatDate(doc.uploadedAt)}</p>
                      <p className="text-fx-14 text-secondary">{uploader?.name}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
