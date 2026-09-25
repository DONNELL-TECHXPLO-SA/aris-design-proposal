import { Check as IconCheck } from "lucide-react";
import type React from "react";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`group flex cursor-pointer items-center gap-[12px] ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <div className="relative size-[22px] shrink-0">
        <input
          id={id}
          type="checkbox"
          className={`block size-[22px] cursor-pointer appearance-none rounded-check border-[1.5px] border-check bg-card checked:border-transparent checked:bg-dark disabled:opacity-60 ${className}`}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        {checked && (
          <IconCheck
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-on-dark"
            size={14}
            strokeWidth={3}
          />
        )}
        {disabled && (
          <IconCheck
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-check"
            size={14}
            strokeWidth={3}
          />
        )}
      </div>
      {label && (
        <span className="text-fx-17 text-ink">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
