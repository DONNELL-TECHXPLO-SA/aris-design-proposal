import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from "@/components/ui/stepper/Stepper";
import { ProgressBar } from "@/components/ui/finexy";
import { cn } from "@/utils";

export interface StepDefinition {
  key: string;
  label: string;
}

interface StepProgressProps {
  steps: StepDefinition[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * Shared step-progress indicator, built on the same Stepper primitive as
 * ClaimProgress (components/ui/stepper/Stepper.tsx) — every phase/wizard stepper in
 * the app should render through this one component. Used by the Client's 5-step New
 * Claim wizard (ux-blueprint.md §15), ClaimFormWizard's per-section phases (§6.11), and
 * the Insurer & Assessor assessment-milestone tracker. Completed steps are clickable
 * (jump back) when `onStepClick` is provided; the current step and anything ahead are
 * not, until reached in order.
 */
const StepProgress: React.FC<StepProgressProps> = ({ steps, currentIndex, onStepClick, className = "" }) => {
  return (
    <div className={cn(className)}>
      {/* Desktop / tablet: full stepper */}
      <div className="hidden overflow-x-auto pb-1 sm:block">
        <Stepper
          value={currentIndex + 1}
          onValueChange={onStepClick ? (v) => onStepClick(v - 1) : undefined}
          orientation="horizontal"
          className="min-w-max pt-1"
        >
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            return (
              <StepperItem key={step.key} step={index + 1} disabled={!onStepClick || !isCompleted}>
                {onStepClick ? (
                  <StepperTrigger>
                    <StepperIndicator />
                    <StepperTitle className="hidden md:block">{step.label}</StepperTitle>
                  </StepperTrigger>
                ) : (
                  <>
                    <StepperIndicator />
                    <StepperTitle className="hidden md:block">{step.label}</StepperTitle>
                  </>
                )}
                {index < steps.length - 1 && <StepperSeparator />}
              </StepperItem>
            );
          })}
        </Stepper>
      </div>

      {/* Mobile: condensed label + progress bar — one field-group per screen (§20.2) */}
      <div className="sm:hidden">
        <p className="text-fx-14 text-secondary">
          Step {currentIndex + 1} of {steps.length}
        </p>
        <p className="mt-[2px] text-fx-17 font-medium text-ink">{steps[currentIndex]?.label}</p>
        <ProgressBar value={currentIndex + 1} max={steps.length} className="mt-[10px]" label="Progress" />
      </div>
    </div>
  );
};

export default StepProgress;
