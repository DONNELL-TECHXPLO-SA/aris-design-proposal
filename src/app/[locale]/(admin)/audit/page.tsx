"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Card, CardHeader, SearchField } from "@/components/ui/finexy";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { findClient, findUser, formatDateTime } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useState } from "react";

const dateFieldClass =
  "h-[54px] w-full rounded-field border border-line bg-card px-[16px] text-fx-17 text-ink outline-none focus:border-dark sm:w-[190px]";

// ux-blueprint.md §5 task matrix: Administrator/Manager see everything; a Broker sees
// only their own actions. UC-14 — filterable by date range and action type.
export default function AuditTrailPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const role = currentUser?.role ?? "broker";

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionQuery, setActionQuery] = useState("");

  const entries = [...state.auditEntries]
    .filter((e) => (role === "broker" ? e.actorId === currentUser?.id : true))
    .filter((e) => !dateFrom || e.createdAt >= new Date(dateFrom).toISOString())
    .filter((e) => !dateTo || e.createdAt <= new Date(new Date(dateTo).getTime() + 24 * 60 * 60 * 1000).toISOString())
    .filter((e) => !actionQuery.trim() || e.action.toLowerCase().includes(actionQuery.trim().toLowerCase()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 200);

  return (
    <div>
      <PageBreadcrumb pageTitle="Audit Trail" />
      <Card>
        <CardHeader
          title="Audit Trail"
          actions={
            <>
              <label className="flex w-full flex-col gap-[6px] sm:w-auto">
                <span className="text-fx-15 font-medium text-ink">From</span>
                <input type="date" aria-label="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={dateFieldClass} />
              </label>
              <label className="flex w-full flex-col gap-[6px] sm:w-auto">
                <span className="text-fx-15 font-medium text-ink">To</span>
                <input type="date" aria-label="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={dateFieldClass} />
              </label>
              <label className="flex w-full flex-col gap-[6px] sm:w-auto">
                <span className="text-fx-15 font-medium text-ink">Action contains</span>
                <SearchField value={actionQuery} onChange={setActionQuery} placeholder="e.g. decision, document, closed" />
              </label>
            </>
          }
          className="items-end"
        />
        <div className="mt-[15px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Action</TableCell>
                <TableCell isHeader>Client</TableCell>
                <TableCell isHeader>Actor</TableCell>
                <TableCell isHeader>When</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 && (
                <TableRow>
                  <TableCell className="text-secondary">No activity matches these filters.</TableCell>
                </TableRow>
              )}
              {entries.map((entry) => {
                const actor = findUser(state, entry.actorId);
                const client = findClient(state, entry.clientId);
                return (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.action}</TableCell>
                    <TableCell>{client?.name ?? "—"}</TableCell>
                    <TableCell>{actor?.name ?? (entry.actorId === "system" ? "System" : entry.actorId)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDateTime(entry.createdAt)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
