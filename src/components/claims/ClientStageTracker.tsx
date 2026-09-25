import { CheckLineIcon } from "@/icons";
import { CLIENT_STAGES, clientStageLabel, clientStageOf } from "@/lib/mock/clientStatus";
import { useData } from "@/lib/mock/store";
import type { ClaimStatus } from "@/lib/mock/types";
import { cn } from "@/utils";

// 5-stage horizontal tracker for the User Portal (UC-03). Completed stages are checked,
// the current stage is highlighted (yellow when it's waiting on the client), later stages
// are greyed out. A finalised claim shows every stage complete.
// Finexy styling: 40px stage circles — completed = orange #D31212, current = #1E1E1C
// (or #F5C542 when blocking), upcoming = #E6E6E6. Connectors are 4px bars: orange once
// reached, the diagonal-striped remainder ahead.
export default function ClientStageTracker({ status, blocking }: { status: ClaimStatus; blocking: boolean }) {
  const { state } = useData();
  const current = CLIENT_STAGES.indexOf(clientStageOf(status));
  const finalised = current === CLIENT_STAGES.length - 1;

  return (
    <ol className="grid grid-cols-5 gap-x-[4px]" aria-label="Claim progress">
      {CLIENT_STAGES.map((stage, i) => {
        const done = i < current || finalised;
        const isCurrent = i === current && !finalised;
        const tone = isCurrent ? (blocking ? "amber" : "blue") : done ? "done" : "future";

        return (
          <li key={stage} className="relative flex flex-col items-center text-center" aria-current={isCurrent ? "step" : undefined}>
            {i > 0 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-[16px] right-[calc(50%+24px)] left-[calc(-50%+24px)] h-[4px] -translate-y-1/2 rounded-full sm:top-[20px]",
                  i <= current ? "bg-orange" : "spending-bar-remainder",
                )}
              />
            )}
            <span
              className={cn(
                "tabular-numbers relative z-[1] flex size-[32px] items-center justify-center rounded-full text-fx-15 font-medium sm:size-[40px]",
                tone === "done" && "bg-orange text-white",
                tone === "amber" && "bg-yellow text-card-black",
                tone === "blue" && "bg-dark text-on-dark",
                tone === "future" && "bg-icon text-secondary",
              )}
            >
              {done ? <CheckLineIcon className="size-[18px]" /> : i + 1}
            </span>
            <span
              className={cn(
                "mt-[10px] px-[4px] text-fx-12 leading-tight sm:text-fx-15",
                (tone === "amber" || tone === "blue") && "font-medium text-ink",
                tone === "done" && "text-ink",
                tone === "future" && "text-muted",
              )}
            >
              {clientStageLabel(state, stage)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
