"use client";

import { ChevronDown as IconChevronDown, X as IconX } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
  placeholder = "Select options",
}) => {
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] =
    useState<string[]>(defaultSelected);
  const selectedOptions = isControlled ? value : internalSelected;
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const updateSelection = (newSelected: string[]) => {
    if (!isControlled) setInternalSelected(newSelected);
    onChange?.(newSelected);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (optionValue: string) => {
    const newSelected = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];
    updateSelection(newSelected);
  };

  const removeOption = (optionValue: string) => {
    updateSelection(selectedOptions.filter((v) => v !== optionValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    switch (e.key) {
      case "Enter":
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      case "ArrowUp":
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
    }
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <label
        className="mb-1.5 block text-fx-15 font-medium text-ink"
        id={`${label}-label`}
      >
        {label}
      </label>

      <div className="relative z-20 inline-block w-full">
        <div className="relative flex flex-col items-center">
          <div
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            className="w-full"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-labelledby={`${label}-label`}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
          >
            <div
              className={`mb-2 flex min-h-11 rounded-field border border-line px-3 py-1.5 outline-hidden transition focus:border-line ${ disabled ? "cursor-not-allowed bg-tile opacity-50" : "cursor-pointer" }`}
            >
              <div className="flex flex-auto flex-wrap gap-2">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((value) => {
                    const text =
                      options.find((opt) => opt.value === value)?.text || value;
                    return (
                      <div
                        key={value}
                        className="group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-tile py-1 ps-2.5 pe-2 text-fx-15 text-ink hover:border-line"
                      >
                        <span className="max-w-full flex-initial">{text}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled) removeOption(value);
                          }}
                          disabled={disabled}
                          className="cursor-pointer ps-2 text-secondary group-hover:text-muted disabled:cursor-not-allowed"
                          aria-label={`Remove ${text}`}
                        >
                          <IconX size={14} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="pointer-events-none h-full w-full p-1 pe-2 text-fx-15 text-muted">
                    {placeholder}
                  </div>
                )}
              </div>
              <div className="flex w-7 items-center self-start px-1 py-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                  }}
                  disabled={disabled}
                  className="h-5 w-5 cursor-pointer text-ink outline-hidden focus:outline-hidden disabled:cursor-not-allowed"
                >
                  <IconChevronDown
                    size={20}
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              className="max-h-select inset-s-0 absolute top-full z-40 w-full overflow-y-auto rounded-field bg-card"
              onClick={(e) => e.stopPropagation()}
              role="listbox"
              aria-label={label}
            >
              {options.map((option, index) => {
                const isSelected = selectedOptions.includes(option.value);
                const isFocused = index === focusedIndex;

                return (
                  <div
                    key={option.value}
                    className={`hover:bg-primary/5 w-full cursor-pointer rounded-t border-b border-line ${ isFocused ? "bg-primary/5" : "" } ${isSelected ? "bg-primary/10" : ""}`}
                    onClick={() => handleSelect(option.value)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="relative flex w-full items-center p-2">
                      <div className="mx-2 leading-6 text-ink">
                        {option.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
