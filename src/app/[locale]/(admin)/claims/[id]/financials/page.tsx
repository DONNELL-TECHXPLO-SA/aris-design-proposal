"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { findSection, formatCurrency } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useClaimAccess } from "@/lib/mock/useClaimAccess";
import { useParams } from "next/navigation";
import { useState } from "react";

// Summary figure in the Finexy KPI-tile style (#F5F5F5 tile, 20px radius, big tabular number).
function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[130px] flex-col justify-between gap-[16px] rounded-tile bg-tile p-[20px]">
      <dt className="text-fx-17 leading-tight text-ink">{label}</dt>
      <dd className="tabular-numbers text-fx-32 leading-none font-[500] text-ink">{value}</dd>
    </div>
  );
}

export default function ClaimFinancialsPage() {
  const { id } = useParams<{ id: string }>();
  const { claim } = useClaimAccess(id);
  const { state, updateFinancials } = useData();
  const { currentUser } = useAuth();
  const [gross, setGross] = useState(claim?.grossAmount?.toString() ?? "");

  if (!claim || !currentUser) return null;

  const section = findSection(state, claim.sectionId);
  const excess = section?.excess ?? 0;
  const grossAmount = claim.grossAmount ?? 0;
  const vatRate = state.companySettings.vatRate;
  const vatAmount = (grossAmount * vatRate) / 100;
  const netClaim = Math.max(0, grossAmount - excess);

  return (
    <div className="grid grid-cols-1 items-start gap-[25px] lg:grid-cols-2">
      <ComponentCard title="Update Gross Claim Amount">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const value = Number(gross);
            if (Number.isFinite(value) && value >= 0) {
              updateFinancials({ claimId: claim.id, grossAmount: value, actorId: currentUser.id, actorRole: currentUser.role });
            }
          }}
          className="space-y-[20px]"
        >
          <div>
            <Label>Gross Claim Amount (ZAR)</Label>
            <Input type="number" min={0} value={gross} onChange={(e) => setGross(e.target.value)} />
          </div>
          <Button>Save</Button>
        </form>
      </ComponentCard>

      <ComponentCard title="Summary">
        <dl className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
          <SummaryTile label="Gross Claim Amount" value={formatCurrency(grossAmount)} />
          <SummaryTile label="Policy Excess" value={formatCurrency(excess)} />
          <SummaryTile label={`VAT (${vatRate}%, informational)`} value={formatCurrency(vatAmount)} />
          <SummaryTile label="Net Claim" value={formatCurrency(netClaim)} />
        </dl>
      </ComponentCard>
    </div>
  );
}
