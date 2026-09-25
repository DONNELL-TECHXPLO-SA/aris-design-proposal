import { ChevronDownIcon } from "@/icons";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value); // Trigger parent handler
  };

  return (
    <div className="relative">
      <select
        className={`h-[54px] w-full appearance-none rounded-field border border-line bg-card ps-[16px] pe-[46px] text-fx-17 outline-none focus:border-dark ${
          selectedValue ? "text-ink" : "text-secondary"
        } ${className}`}
        value={selectedValue}
        onChange={handleChange}
      >
        {/* Placeholder option */}
        <option
          value=""
          disabled
          className="bg-card text-secondary"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-card text-ink"
          >
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute end-[16px] top-1/2 -translate-y-1/2 text-ink">
        <ChevronDownIcon size={20} />
      </span>
    </div>
  );
};

export default Select;
