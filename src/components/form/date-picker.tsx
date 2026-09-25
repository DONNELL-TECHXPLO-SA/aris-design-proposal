"use client";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useEffect } from "react";
import { CalenderIcon } from "../../icons";
import Label from "./Label";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full appearance-none rounded-field border border-line bg-transparent px-4 py-2.5 text-fx-15 text-ink placeholder:text-muted focus:border-line focus:ring-3 focus:ring-dark/20 focus:outline-hidden"
        />

        <span className="inset-e-3 pointer-events-none absolute top-1/2 -translate-y-1/2 text-secondary">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
