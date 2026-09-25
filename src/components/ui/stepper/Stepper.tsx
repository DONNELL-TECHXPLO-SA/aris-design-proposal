"use client";

import { CheckLineIcon } from "@/icons";
import { cn } from "@/utils";
import * as React from "react";
import { createContext, useContext } from "react";

type StepState = "active" | "completed" | "inactive" | "loading";

type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

const StepperContext = createContext<StepperContextValue | undefined>(undefined);
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined);

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) throw new Error("useStepper must be used within a Stepper");
  return context;
};

const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) throw new Error("useStepItem must be used within a StepperItem");
  return context;
};

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    { defaultValue = 0, value, onValueChange, orientation = "horizontal", className, ...props },
    ref,
  ) => {
    const [activeStep, setInternalStep] = React.useState(defaultValue);

    const setActiveStep = React.useCallback(
      (step: number) => {
        if (value === undefined) setInternalStep(step);
        onValueChange?.(step);
      },
      [value, onValueChange],
    );

    const currentStep = value ?? activeStep;

    return (
      <StepperContext.Provider value={{ activeStep: currentStep, setActiveStep, orientation }}>
        <div
          ref={ref}
          className={cn(
            "group/stepper flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
            className,
          )}
          data-orientation={orientation}
          {...props}
        />
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    { step, completed = false, disabled = false, loading = false, className, children, ...props },
    ref,
  ) => {
    const { activeStep } = useStepper();

    const state: StepState =
      completed || step < activeStep ? "completed" : activeStep === step ? "active" : "inactive";

    const isLoading = loading && step === activeStep;

    return (
      <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
        <div
          ref={ref}
          className={cn(
            "group/step flex items-center gap-3 max-sm:gap-[4px] data-[orientation=horizontal]/stepper:flex-1 data-[orientation=horizontal]/stepper:flex-row data-[orientation=vertical]/stepper:flex-col data-[orientation=vertical]/stepper:gap-2 data-[orientation=vertical]/stepper:items-start",
            className,
          )}
          data-state={state}
          {...(isLoading ? { "data-loading": "true" } : {})}
          {...props}
        >
          {children}
        </div>
      </StepItemContext.Provider>
    );
  },
);
StepperItem.displayName = "StepperItem";

interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { setActiveStep } = useStepper();
    const { step, isDisabled } = useStepItem();

    if (asChild) {
      return <div className={className}>{children}</div>;
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-3 text-start disabled:pointer-events-none",
          className,
        )}
        onClick={() => setActiveStep(step)}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);
StepperTrigger.displayName = "StepperTrigger";

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { state, step, isLoading } = useStepItem();

    return (
      <div
        ref={ref}
        className={cn(
          "tabular-numbers relative flex size-[28px] shrink-0 sm:size-[40px] items-center justify-center rounded-full bg-icon text-fx-15 font-medium text-ink",
          "data-[state=active]:bg-dark data-[state=active]:text-on-dark",
          "data-[state=completed]:bg-orange data-[state=completed]:text-white",
          className,
        )}
        data-state={state}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <span className="group-data-[state=completed]/step:scale-0 group-data-[state=completed]/step:opacity-0 group-data-[loading=true]/step:scale-0 group-data-[loading=true]/step:opacity-0 group-data-[loading=true]/step:transition-none">
              {step}
            </span>
            <CheckLineIcon
              className="absolute size-[14px] scale-0 sm:size-[18px] opacity-0 group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
              aria-hidden="true"
            />
            {isLoading && (
              <span
                className="absolute size-3.5 animate-spin rounded-full border-2 border-current border-s-transparent"
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>
    );
  },
);
StepperIndicator.displayName = "StepperIndicator";

type StepperTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const StepperTitle = React.forwardRef<HTMLHeadingElement, StepperTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-fx-17 font-normal whitespace-nowrap text-secondary",
        "group-data-[state=active]/step:font-medium group-data-[state=active]/step:text-ink",
        "group-data-[state=completed]/step:text-ink",
        className,
      )}
      {...props}
    />
  ),
);
StepperTitle.displayName = "StepperTitle";

type StepperSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const StepperSeparator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "m-0.5 rounded-full bg-icon",
        "group-data-[orientation=horizontal]/stepper:h-[4px] group-data-[orientation=horizontal]/stepper:min-w-[4px] sm:group-data-[orientation=horizontal]/stepper:min-w-[24px] group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=horizontal]/stepper:flex-1",
        "group-data-[orientation=vertical]/stepper:h-full group-data-[orientation=vertical]/stepper:w-[4px] group-data-[orientation=vertical]/stepper:flex-none",
        "group-data-[state=completed]/step:bg-orange",
        className,
      )}
      {...props}
    />
  ),
);
StepperSeparator.displayName = "StepperSeparator";

export { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger };

export default Stepper;