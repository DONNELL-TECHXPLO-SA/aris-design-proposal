"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EmptyState, PageHeader, StatusDot } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { findClient, formatDate, formatDateTime, reportScopeLabel } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { ReportType } from "@/lib/mock/types";
import { useState } from "react";

export default function ClientReportsPage() {
  const { currentUser } = useAuth();
  const { state, addReport } = useData();
  const [type, setType] = useState<ReportType>("claims_history");
  const [scopeType, setScopeType] = useState<"consolidated" | "policy">("consolidated");
  const [policyId, setPolicyId] = useState("");
  const [generated, setGenerated] = useState(false);
  if (!currentUser) return null;

  const client = findClient(state, currentUser.clientId);
  const reports = state.reports.filter((r) => r.clientId === currentUser.clientId);
  const policies = state.policies.filter((p) => p.clientId === currentUser.clientId);

  return (
    <div className="space-y-[25px]">
      <PageHeader title="Reports" />
      <ComponentCard title="Generate Report" desc={`For ${client?.name}, current underwriting year.`}>
        <div className="grid gap-[20px] md:grid-cols-2">
          <div>
            <Label>Report Type</Label>
            <Select
              options={[
                { value: "claims_history", label: "Claims History" },
                { value: "performance", label: "Performance" },
              ]}
              defaultValue={type}
              onChange={(v) => setType(v as ReportType)}
            />
          </div>
          <div>
            <Label>Scope</Label>
            <Select
              options={[
                { value: "consolidated", label: "Consolidated — all policies" },
                { value: "policy", label: "Single policy" },
              ]}
              defaultValue={scopeType}
              onChange={(v) => setScopeType(v as "consolidated" | "policy")}
            />
          </div>
          {scopeType === "policy" && (
            <div>
              <Label>Policy</Label>
              <Select options={policies.map((p) => ({ value: p.id, label: p.policyNumber }))} placeholder="Select a policy" onChange={setPolicyId} />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-[15px] md:col-span-2">
          <Button
            disabled={scopeType === "policy" && !policyId}
            onClick={() => {
              if (!client) return;
              addReport({
                type,
                clientId: client.id,
                scope: scopeType === "policy" ? { policyId } : "consolidated",
                periodStart: new Date(new Date().getFullYear(), 0, 1).toISOString(),
                periodEnd: new Date().toISOString(),
                generatedById: currentUser.id,
              });
              setGenerated(true);
            }}
          >
            Generate
          </Button>
          {generated && <StatusDot tone="green">Report generated and stored below.</StatusDot>}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Your Reports">
        {reports.length === 0 ? (
          <EmptyState title="No reports generated yet." />
        ) : (
          <ul className="flex flex-col gap-[10px] rounded-tile bg-tile p-[10px]">
            {reports.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-[12px] rounded-mini bg-card px-[16px] py-[12px]">
                <div>
                  <p className="text-fx-17 text-ink">{r.type === "claims_history" ? "Claims History" : "Performance"}</p>
                  <p className="text-fx-14 text-secondary">
                    {formatDate(r.periodStart)} — {formatDate(r.periodEnd)} · {reportScopeLabel(r.scope, state.policies)}
                  </p>
                </div>
                <p className="text-fx-15 text-secondary">{formatDateTime(r.generatedAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </ComponentCard>
    </div>
  );
}
