"use client";

import ClaimsTable from "@/components/claims/ClaimsTable";
import { Card, CardHeader } from "@/components/ui/finexy";
import { sortClaimsByAttention } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useParams } from "next/navigation";

export default function ClientClaimsPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useData();
  const claims = sortClaimsByAttention(state.claims.filter((c) => c.clientId === id));

  return (
    <Card>
      <CardHeader title="Claims" />
      <div className="mt-[15px]">
        <ClaimsTable claims={claims} showClientColumn={false} showBrokerColumn emptyMessage="This client has no claims yet." />
      </div>
    </Card>
  );
}
