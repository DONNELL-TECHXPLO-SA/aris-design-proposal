import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        // Default classes that apply by default
        "mb-[8px] block text-fx-15 font-medium text-ink",

        // User-defined className that can override the default margin
        className,
      )}
    >
      {children}
    </label>
  );
};

export default Label;
