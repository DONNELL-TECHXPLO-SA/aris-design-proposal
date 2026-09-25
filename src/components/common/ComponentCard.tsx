import { CardHeader } from "@/components/ui/finexy";
import { cn } from "@/utils";
import React from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  /** Optional header actions (pill buttons, search) on the right of the title. */
  actions?: React.ReactNode;
}

// Finexy card: #FFF, radius 24px, 25px padding, no shadow/border. 20px/500 title,
// 17px grey description.
const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  actions,
}) => {
  return (
    <div className={cn("rounded-card bg-card p-[18px] md:p-[25px]", className)}>
      <CardHeader title={title} subtitle={desc || undefined} actions={actions} size="card" />
      <div className="mt-[16px] space-y-[16px] md:mt-[20px] md:space-y-[20px]">{children}</div>
    </div>
  );
};

export default ComponentCard;
