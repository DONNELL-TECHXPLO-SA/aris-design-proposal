"use client";

import StatusBadge from "@/components/claims/StatusBadge";
import { EmptyState, RowIcon } from "@/components/ui/finexy";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { findClient, findSection, findUser, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Claim } from "@/lib/mock/types";
import { Ellipsis, FileText, TriangleAlert } from "lucide-react";

interface ClaimsTableProps {
  claims: Claim[];
  showClientColumn?: boolean;
  showBrokerColumn?: boolean;
  emptyMessage?: string;
}

// Finexy "Recent Activities" table: grey header row, 63px rows, a 32px round icon beside
// the reference, status as a 7px dot + label, and a "…" row control that opens the claim.
export default function ClaimsTable({
  claims,
  showClientColumn = true,
  showBrokerColumn = false,
  emptyMessage = "No claims match this view.",
}: ClaimsTableProps) {
  const { state } = useData();

  if (claims.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Reference</TableCell>
          {showClientColumn && <TableCell isHeader>Client</TableCell>}
          <TableCell isHeader>Type &amp; Insurer</TableCell>
          {showBrokerColumn && <TableCell isHeader>Broker</TableCell>}
          <TableCell isHeader>Status</TableCell>
          <TableCell isHeader>Updated</TableCell>
          <TableCell isHeader className="w-[30px]">
            <span className="sr-only">Actions</span>
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims.map((claim) => {
          const client = findClient(state, claim.clientId);
          const section = findSection(state, claim.sectionId);
          const broker = findUser(state, claim.brokerId);
          return (
            <TableRow key={claim.id}>
              <TableCell className="whitespace-nowrap">
                <Link href={`/claims/${claim.id}`} className="flex items-center gap-[12px]">
                  <RowIcon>
                    <FileText size={16} strokeWidth={1.5} />
                  </RowIcon>
                  <span className="font-normal text-ink">{claim.reference}</span>
                  {claim.lateReported && (
                    <TriangleAlert size={16} strokeWidth={1.5} className="shrink-0 text-orange" aria-label="Late reported" />
                  )}
                </Link>
              </TableCell>
              {showClientColumn && <TableCell className="whitespace-nowrap">{client?.name ?? "—"}</TableCell>}
              <TableCell className="whitespace-nowrap">
                {claim.claimType}
                {section?.insurer && <span className="text-secondary"> · {section.insurer}</span>}
              </TableCell>
              {showBrokerColumn && <TableCell className="whitespace-nowrap">{broker?.name ?? "—"}</TableCell>}
              <TableCell className="whitespace-nowrap">
                <StatusBadge status={claim.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatDate(claim.updatedAt)}</TableCell>
              <TableCell className="w-[30px]">
                <Link
                  href={`/claims/${claim.id}`}
                  aria-label={`Open claim ${claim.reference}`}
                  className="flex items-center justify-end text-muted hover:text-ink"
                >
                  <Ellipsis size={20} />
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
