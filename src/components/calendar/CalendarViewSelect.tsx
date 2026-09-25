"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils";
import { ChevronDown as IconChevronDown } from "lucide-react";
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CALENDAR_VIEW_OPTIONS } from "./types";

export interface CalendarViewSelectProps {
  currentView: string;
  onViewChange: (viewKey: string) => void;
  portalNode: Element | null;
}

const CalendarViewSelect: React.FC<CalendarViewSelectProps> = ({
  currentView,
  onViewChange,
  portalNode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const activeOption =
    CALENDAR_VIEW_OPTIONS.find((v) => v.key === currentView) ||
    CALENDAR_VIEW_OPTIONS.find((v) => v.key === "dayGridMonth") ||
    CALENDAR_VIEW_OPTIONS[1];

  const handleSelect = (viewKey: string) => {
    onViewChange(viewKey);
    setIsOpen(false);
  };

  if (!portalNode) return null;

  return createPortal(
    <div className="calendar-view-dropdown relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="calendar-view-btn flex h-9 w-full min-w-18 items-center justify-center gap-1 rounded-field border border-line ps-2.5 pe-1.5 text-fx-14 font-medium text-ink sm:min-w-20 sm:gap-1.5 sm:ps-3 sm:pe-2 sm:text-fx-15"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="calendar-view-label">{activeOption.label}</span>
        <IconChevronDown
          size={16}
          className={cn(
            "calendar-view-chevron h-4 w-4 transition-transform duration-200 sm:h-4.5 sm:w-4.5",
            {
              "rotate-180": isOpen,
            },
          )}
        />
      </button>

      {isOpen && (
        <div className="calendar-view-menu absolute inset-e-0 z-50 mt-1.5 w-36 max-w-[calc(100vw-32px)] space-y-0.5 rounded-tile border border-line bg-card p-1.5 sm:w-38">
          {CALENDAR_VIEW_OPTIONS.map((view) => (
            <button
              key={view.key}
              type="button"
              data-view-key={view.key}
              onClick={() => handleSelect(view.key)}
              className={cn(
                "calendar-view-option w-full rounded-field px-2.5 py-1.5 text-start text-fx-14 text-ink hover:bg-tile sm:text-fx-15",
                currentView === view.key
                  ? "bg-tile font-medium"
                  : "font-normal",
              )}
            >
              {view.label}
            </button>
          ))}
        </div>
      )}
    </div>,
    portalNode,
  );
};

export default CalendarViewSelect;
