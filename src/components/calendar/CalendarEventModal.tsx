"use client";

import { Modal } from "@/components/ui/modal";
import { cn } from "@/utils";
import React, { useEffect, useState } from "react";
import {
  CALENDAR_EVENT_LEVELS,
  type CalendarEvent,
  type EventFormData,
} from "./types";

export interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: CalendarEvent | null;
  initialStartDate?: string;
  initialEndDate?: string;
  onSave: (data: EventFormData) => void;
}

const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  initialStartDate = "",
  initialEndDate = "",
  onSave,
}) => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("Primary");

  useEffect(() => {
    if (selectedEvent) {
      setEventTitle((selectedEvent.title as string) || "");
      const startStr =
        typeof selectedEvent.start === "string"
          ? selectedEvent.start.split("T")[0]
          : selectedEvent.start instanceof Date
            ? selectedEvent.start.toISOString().split("T")[0]
            : "";
      const endStr =
        typeof selectedEvent.end === "string"
          ? selectedEvent.end.split("T")[0]
          : selectedEvent.end instanceof Date
            ? selectedEvent.end.toISOString().split("T")[0]
            : "";
      setEventStartDate(startStr);
      setEventEndDate(endStr || startStr);
      setEventLevel(selectedEvent.extendedProps?.calendar || "Primary");
    } else {
      setEventTitle("");
      setEventStartDate(initialStartDate);
      setEventEndDate(initialEndDate || initialStartDate);
      setEventLevel("Primary");
    }
  }, [selectedEvent, initialStartDate, initialEndDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal =
      eventTitle.trim() || (selectedEvent ? "Event" : "New Event");
    const startDateVal = eventStartDate;
    const endDateVal = eventEndDate || startDateVal;
    const levelVal = eventLevel || "Primary";

    onSave({
      title: titleVal,
      start: startDateVal,
      end: endDateVal,
      level: levelVal,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-175 p-4 sm:p-6 lg:p-10"
    >
      <form
        onSubmit={handleSubmit}
        className="flex custom-scrollbar flex-col overflow-y-auto px-1 sm:px-2"
      >
        <div>
          <h5 className="modal-title mb-2 text-fx-20 font-medium text-ink lg:text-fx-24">
            {selectedEvent ? "Edit Event" : "Add Event"}
          </h5>
          <p className="text-fx-15 text-secondary">
            Plan your next big moment: schedule or edit an event to stay on
            track
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="event-title"
              className="mb-1.5 block text-fx-15 font-medium text-ink"
            >
              Event Title
            </label>
            <input
              id="event-title"
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="h-11 w-full rounded-field border border-line bg-transparent px-4 py-2.5 text-fx-15 text-ink placeholder:text-muted focus:border-line focus:ring-3 focus:ring-dark/10 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="mb-4 block text-fx-15 font-medium text-ink">
              Event Color
            </label>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {Object.entries(CALENDAR_EVENT_LEVELS).map(([key, value]) => (
                <div key={key} className="n-chk">
                  <div
                    className={`form-check form-check-${value} form-check-inline`}
                  >
                    <label
                      className="form-check-label flex items-center text-fx-15 text-ink"
                      htmlFor={`modal${key}`}
                    >
                      <span className="relative">
                        <input
                          className="form-check-input sr-only"
                          type="radio"
                          name="event-level"
                          value={key}
                          id={`modal${key}`}
                          checked={eventLevel === key}
                          onChange={() => setEventLevel(key)}
                        />
                        <span className="box me-2 flex h-5 w-5 items-center justify-center rounded-full border border-line">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full bg-card",
                              eventLevel === key ? "block" : "hidden",
                            )}
                          />
                        </span>
                      </span>
                      {key}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="event-start-date"
              className="mb-1.5 block text-fx-15 font-medium text-ink"
            >
              Enter Start Date
            </label>
            <div className="relative">
              <input
                id="event-start-date"
                type="date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="h-11 w-full appearance-none rounded-field border border-line bg-transparent bg-none py-2.5 ps-4 pe-11 text-fx-15 text-ink placeholder:text-muted focus:border-line focus:ring-3 focus:ring-dark/10 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="event-end-date"
              className="mb-1.5 block text-fx-15 font-medium text-ink"
            >
              Enter End Date
            </label>
            <div className="relative">
              <input
                id="event-end-date"
                type="date"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className="h-11 w-full appearance-none rounded-field border border-line bg-transparent bg-none py-2.5 ps-4 pe-11 text-fx-15 text-ink placeholder:text-muted focus:border-line focus:ring-3 focus:ring-dark/10 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer mt-6 flex items-center gap-3 sm:justify-end">
          <button
            onClick={onClose}
            type="button"
            className="modal-close-btn flex w-full justify-center rounded-full bg-tile px-4 py-2.5 text-fx-15 font-medium text-ink hover:bg-hover sm:w-auto"
          >
            Close
          </button>
          <button
            type="submit"
            className={cn(
              "flex h-[44px] w-full items-center justify-center rounded-full bg-dark px-[20px] text-fx-17 font-medium text-on-dark hover:opacity-95 sm:w-auto",
              selectedEvent ? "btn-update-event" : "btn-add-event",
            )}
          >
            {selectedEvent ? "Update Changes" : "Add Event"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CalendarEventModal;
