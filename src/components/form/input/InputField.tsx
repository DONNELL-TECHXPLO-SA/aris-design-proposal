import type React from "react";
import type { FC } from "react";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "success" | "error" | "hint" | "step"
> {
  success?: boolean;
  error?: boolean;
  hint?: string;
  step?: number;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  defaultValue,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  ...props
}) => {
  let inputClasses = ` h-[54px] w-full rounded-field border appearance-none px-[16px] text-fx-17 outline-none placeholder:text-secondary ${className}`;

  if (disabled) {
    inputClasses += ` border-line bg-tile text-muted cursor-not-allowed`;
  } else if (error) {
    inputClasses += ` border-red bg-card text-ink`;
  } else if (success) {
    inputClasses += ` border-green bg-card text-ink`;
  } else {
    inputClasses += ` border-line bg-card text-ink focus:border-dark`;
  }

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />

      {hint && (
        <p
          className={`mt-[6px] text-fx-14 ${
            error ? "text-red" : success ? "text-green" : "text-secondary"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
