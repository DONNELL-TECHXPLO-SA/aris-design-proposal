import React from "react";

interface RadioProps {
  id: string; // Unique ID for the radio button
  name: string; // Radio group name
  value: string; // Value of the radio button
  checked: boolean; // Whether the radio button is checked
  label: string; // Label for the radio button
  onChange: (value: string) => void; // Handler for value change
  className?: string; // Optional additional classes
  disabled?: boolean; // Optional disabled state for the radio button
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked,
  label,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer select-none items-center gap-[12px] text-fx-17 ${
        disabled ? "cursor-not-allowed text-muted" : "text-ink"
      } ${className}`}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange(value)} // Prevent onChange when disabled
        className="sr-only"
        disabled={disabled} // Disable input
      />
      <span
        className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
          checked ? "border-transparent bg-dark" : "border-check bg-card"
        } ${disabled ? "bg-tile" : ""}`}
      >
        <span
          className={`size-[8px] rounded-full bg-on-dark ${
            checked ? "block" : "hidden"
          }`}
        ></span>
      </span>
      {label}
    </label>
  );
};

export default Radio;
