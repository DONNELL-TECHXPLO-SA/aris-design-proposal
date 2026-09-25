import React from "react";

interface TextareaProps {
  placeholder?: string; // Placeholder text
  rows?: number; // Number of rows
  value?: string; // Current value
  onChange?: (value: string) => void; // Change handler
  className?: string; // Additional CSS classes
  disabled?: boolean; // Disabled state
  error?: boolean; // Error state
  hint?: string; // Hint text to display
}

const TextArea: React.FC<TextareaProps> = ({
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  value = "", // Default value
  onChange, // Callback for changes
  className = "", // Additional custom styles
  disabled = false, // Disabled state
  error = false, // Error state
  hint = "", // Default hint text
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  let textareaClasses = `w-full rounded-field border px-[16px] py-[14px] text-fx-17 outline-none placeholder:text-secondary ${className}`;

  if (disabled) {
    textareaClasses += ` bg-tile text-muted border-line cursor-not-allowed`;
  } else if (error) {
    textareaClasses += ` bg-card text-ink border-red`;
  } else {
    textareaClasses += ` bg-card text-ink border-line focus:border-dark`;
  }

  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={textareaClasses}
      />
      {hint && (
        <p
          className={`mt-[6px] text-fx-14 ${error ? "text-red" : "text-secondary"}`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
