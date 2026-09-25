interface RadioProps {
  id: string; // Unique ID for the radio button
  name: string; // Group name for the radio button
  value: string; // Value of the radio button
  checked: boolean; // Whether the radio button is checked
  label: string; // Label text for the radio button
  onChange: (value: string) => void; // Handler for when the radio button is toggled
  className?: string; // Optional custom classes for styling
}

const RadioSm: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked,
  label,
  onChange,
  className = "",
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center text-fx-15 text-ink select-none ${className}`}
    >
      <span className="relative">
        {/* Hidden Input */}
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        {/* Styled Radio Circle */}
        <span
          className={`me-[8px] flex size-[18px] items-center justify-center rounded-full border-[1.5px] ${
            checked ? "border-transparent bg-dark" : "border-check bg-card"
          }`}
        >
          {/* Inner Dot */}
          <span
            className={`size-[6px] rounded-full ${checked ? "bg-on-dark" : "bg-transparent"}`}
          ></span>
        </span>
      </span>
      {label}
    </label>
  );
};

export default RadioSm;
