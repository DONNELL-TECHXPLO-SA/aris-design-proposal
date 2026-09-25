import { clientStageLabel, clientStageOf } from "@/lib/mock/clientStatus";
import { useData } from "@/lib/mock/store";
import type { ClaimStatus, ClientStage } from "@/lib/mock/types";
import { cn } from "@/utils";

// Finexy status: a 7px coloured dot plus the label, on a grey pill.
const STAGE_DOT: Record<ClientStage, string> = {
  received: "bg-blue",
  documents_outstanding: "bg-yellow",
  with_insurer: "bg-blue",
  decision_received: "bg-green",
  finalised: "bg-muted",
};

// Client-facing counterpart to StatusBadge: renders the Administrator-configured stage
// label, never the internal status name.
export default function ClientStatusPill({ status, className }: { status: ClaimStatus; className?: string }) {
  const { state } = useData();
  const stage = clientStageOf(status);

  return (
    <span className={cn("inline-flex shrink-0 items-center gap-[8px] rounded-full bg-tile px-[12px] py-[4px] text-fx-15 whitespace-nowrap text-ink", className)}>
      <span className={cn("size-[7px] rounded-full", STAGE_DOT[stage])} aria-hidden />
      {clientStageLabel(state, stage)}
    </span>
  );
}
