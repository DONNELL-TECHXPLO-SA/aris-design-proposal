"use client";

import { useState } from "react";

interface SwitchProps {
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray"; // Added prop to toggle color theme
}

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "blue", // Default to blue color
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  const switchColors =
    color === "blue"
      ? {
          background: isChecked ? "bg-dark" : "bg-icon", // Primary version
          knob: isChecked
            ? "translate-x-[22px] rtl:-translate-x-[22px] bg-card"
            : "translate-x-0 bg-card",
        }
      : {
          background: isChecked ? "bg-orange" : "bg-icon", // Accent version
          knob: isChecked
            ? "translate-x-[22px] rtl:-translate-x-[22px] bg-card"
            : "translate-x-0 bg-card",
        };

  return (
    <label
      className={`flex cursor-pointer items-center gap-[12px] text-fx-17 select-none ${
        disabled ? "text-muted" : "text-ink"
      }`}
      onClick={handleToggle} // Toggle when the label itself is clicked
    >
      <div className="relative">
        <div
          className={`block h-[28px] w-[50px] rounded-full transition duration-150 ease-linear ${
            disabled ? "pointer-events-none bg-tile" : switchColors.background
          }`}
        ></div>
        <div
          className={`absolute start-[3px] top-[3px] size-[22px] transform rounded-full duration-150 ease-linear ${switchColors.knob}`}
        ></div>
      </div>
      {label}
    </label>
  );
};

export default Switch;
