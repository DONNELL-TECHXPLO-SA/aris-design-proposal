import { cn } from "@/utils";
import type { EventDisplayInfo } from "@fullcalendar/react";
import React from "react";

export interface CalendarEventItemProps {
  eventInfo: EventDisplayInfo;
}

const CalendarEventItem: React.FC<CalendarEventItemProps> = ({ eventInfo }) => {
  const calendarLevel = (
    eventInfo.event.extendedProps?.calendar || "primary"
  ).toLowerCase();

  // Color mappings
  const colorMap: Record<
    string,
    { bg: string; dot: string; title: string; time: string }
  > = {
    success: {
      bg: "border border-line bg-green-soft",
      dot: "bg-green",
      title: "text-green",
      time: "text-green/80",
    },
    danger: {
      bg: "border border-line bg-red-soft",
      dot: "bg-red",
      title: "text-red",
      time: "text-red/80",
    },
    primary: {
      bg: "border border-line bg-tile",
      dot: "bg-dark",
      title: "text-orange",
      time: "text-orange/80",
    },
    warning: {
      bg: "border border-line bg-tile",
      dot: "bg-orange",
      title: "text-orange",
      time: "text-orange/80",
    },
  };

  const colors = colorMap[calendarLevel] ?? colorMap.primary;
  const isTimeGridView =
    !eventInfo.event?.allDay &&
    eventInfo.view?.type &&
    eventInfo.view.type.startsWith("timeGrid");

  if (isTimeGridView) {
    return (
      <div
        dir="ltr"
        className={cn(
          "event-fc-color flex h-full w-full flex-col justify-start overflow-hidden rounded-chip p-1 transition-colors sm:rounded-field sm:p-1.5",
          colors.bg,
        )}
      >
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div
            className={cn("size-1.5 shrink-0 rounded-full sm:size-2", colors.dot)}
          />
          <div
            className={cn(
              "truncate text-fx-11 font-medium leading-tight sm:text-fx-14",
              colors.title,
            )}
          >
            {eventInfo.event.title || ""}
          </div>
        </div>
        {eventInfo.timeText && (
          <div
            className={cn(
              "mt-0.5 truncate ps-2.5 text-fx-10 font-medium leading-tight sm:ps-3.5 sm:text-fx-11",
              colors.time,
            )}
          >
            {eventInfo.timeText}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      className={cn(
        "event-fc-color flex items-center rounded-chip py-1 ps-1.5 pe-2 transition-colors sm:rounded-field sm:py-1.5 sm:ps-2.5 sm:pe-3",
        colors.bg,
      )}
    >
      <div
        className={cn(
          "fc-daygrid-event-dot ms-0 me-1 h-2.5 w-1 shrink-0 rounded-full border-none sm:me-2 sm:h-3.5",
          colors.dot,
        )}
      />
      {eventInfo.timeText && (
        <div className="fc-event-time me-1 p-0 text-fx-10 font-normal text-secondary sm:me-1.5 sm:text-fx-14">
          {eventInfo.timeText}
        </div>
      )}
      <div className="fc-event-title truncate p-0 text-fx-11 font-medium text-ink sm:text-fx-14">
        {eventInfo.event.title || ""}
      </div>
    </div>
  );
};

export default CalendarEventItem;
