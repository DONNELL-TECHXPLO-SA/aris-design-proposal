"use client";

import StatusBadge from "@/components/claims/StatusBadge";
import { EmptyState, RowIcon } from "@/components/ui/finexy";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import {
  findClient,
  findSection,
  findUser,
  formatDate,
} from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Claim } from "@/lib/mock/types";
import { ChevronRight, Ellipsis, FileText, TriangleAlert } from "lucide-react";

interface ClaimsTableProps {
  claims: Claim[];
  showClientColumn?: boolean;
  showBrokerColumn?: boolean;
  emptyMessage?: string;
}

// Finexy "Recent Activities" table: grey header row, 63px rows, a 32px round icon beside
// the reference, status as a 7px dot + label, and a "…" row control that opens the claim.
// Below lg the table gives way to a card list — one tappable card per claim.
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
    <>
      <ul className="overflow-hidden rounded-tile border border-line-soft lg:hidden">
        {claims.map((claim) => {
          const client = findClient(state, claim.clientId);
          const section = findSection(state, claim.sectionId);
          const broker = findUser(state, claim.brokerId);
          return (
            <li
              key={claim.id}
              className="border-b border-line-soft last:border-b-0"
            >
              <Link
                href={`/claims/${claim.id}`}
                className="flex items-center gap-[12px] px-[16px] py-[14px] active:bg-tile"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-[8px]">
                    <span className="tabular-numbers text-fx-17 font-medium text-ink">
                      {claim.reference}
                    </span>
                    {claim.lateReported && (
                      <TriangleAlert
                        size={16}
                        strokeWidth={1.5}
                        className="shrink-0 text-orange"
                        aria-label="Late reported"
                      />
                    )}
                  </div>
                  {showClientColumn && (
                    <p className="mt-[2px] truncate text-fx-15 text-ink">
                      {client?.name ?? "—"}
                    </p>
                  )}
                  <p className="mt-[2px] truncate text-fx-14 text-secondary">
                    {claim.claimType}
                    {section?.insurer && <> · {section.insurer}</>}
                    {showBrokerColumn && broker && <> · {broker.name}</>}
                  </p>
                  <div className="mt-[8px] flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[4px]">
                    <StatusBadge status={claim.status} size="sm" />
                    <span className="text-fx-14 text-muted">
                      {formatDate(claim.updatedAt)}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  strokeWidth={1.5}
                  className="shrink-0 text-muted rtl:rotate-180"
                />
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="hidden lg:block">
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
                    <Link
                      href={`/claims/${claim.id}`}
                      className="flex items-center gap-[12px]"
                    >
                      <RowIcon>
                        <FileText size={16} strokeWidth={1.5} />
                      </RowIcon>
                      <span className="font-normal text-ink">
                        {claim.reference}
                      </span>
                      {claim.lateReported && (
                        <TriangleAlert
                          size={16}
                          strokeWidth={1.5}
                          className="shrink-0 text-orange"
                          aria-label="Late reported"
                        />
                      )}
                    </Link>
                  </TableCell>
                  {showClientColumn && (
                    <TableCell className="whitespace-nowrap">
                      {client?.name ?? "—"}
                    </TableCell>
                  )}
                  <TableCell className="whitespace-nowrap">
                    {claim.claimType}
                    {section?.insurer && (
                      <span className="text-secondary">
                        {" "}
                        · {section.insurer}
                      </span>
                    )}
                  </TableCell>
                  {showBrokerColumn && (
                    <TableCell className="whitespace-nowrap">
                      {broker?.name ?? "—"}
                    </TableCell>
                  )}
                  <TableCell className="whitespace-nowrap">
                    <StatusBadge status={claim.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(claim.updatedAt)}
                  </TableCell>
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
      </div>
    </>
  );
}
