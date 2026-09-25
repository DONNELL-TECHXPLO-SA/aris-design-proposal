"use client";

import { useTheme } from "@/context/ThemeContext";
import { useModal } from "@/hooks/useModal";
import { isRtl } from "@/i18n/languages";
import type { Locale } from "@/i18n/routing";
import type {
  DateSelectInfo,
  DayCellInfo,
  DayHeaderInfo,
  DayLaneInfo,
  EventClickInfo,
  EventDisplayInfo,
  MoreLinkInfo,
  ToolbarSectionInfo,
} from "@fullcalendar/react";
import FullCalendar, { CalendarRef } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import multiMonthPlugin from "@fullcalendar/react/multimonth";
import themePlugin from "@fullcalendar/react/themes/classic";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { useLocale } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import CalendarEventItem from "./CalendarEventItem";
import CalendarEventModal from "./CalendarEventModal";
import CalendarViewSelect from "./CalendarViewSelect";
import {
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "./icons";
import type { CalendarEvent, EventFormData } from "./types";

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Event Conf.",
    start: new Date().toISOString().split("T")[0],
    extendedProps: { calendar: "Danger" },
  },
  {
    id: "2",
    title: "Meeting",
    start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    extendedProps: { calendar: "Success" },
  },
  {
    id: "3",
    title: "Workshop",
    start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    extendedProps: { calendar: "Primary" },
  },
];

const Calendar: React.FC = () => {
  const locale = useLocale();
  const isRtlLayout = isRtl(locale as Locale);
  const { theme } = useTheme();

  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [portalNode, setPortalNode] = useState<Element | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const calendarRef = useRef<CalendarRef>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const handleViewChange = (viewKey: string) => {
    setCurrentView(viewKey);
    calendarRef.current?.getApi()?.changeView(viewKey);
  };

  const handleOpenAddModal = () => {
    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const combineDate = `${yyyy}-${mm}-${dd}`;

    setSelectedEvent(null);
    setSelectedStartDate(combineDate);
    setSelectedEndDate(combineDate);
    openModal();
  };

  const handleDateSelect = (selectInfo: DateSelectInfo) => {
    const startStr = selectInfo.startStr
      ? selectInfo.startStr.split("T")[0]
      : "";
    const endStr = selectInfo.endStr
      ? selectInfo.endStr.split("T")[0]
      : startStr;

    setSelectedEvent(null);
    setSelectedStartDate(startStr);
    setSelectedEndDate(endStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickInfo) => {
    const event = clickInfo.event;
    if (event.url) {
      window.open(event.url);
      clickInfo.jsEvent?.preventDefault();
      return;
    }

    const startStr = event.startStr ? event.startStr.split("T")[0] : "";
    const endStr = event.endStr ? event.endStr.split("T")[0] : startStr;

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      extendedProps: { calendar: event.extendedProps?.calendar || "Primary" },
    });
    setSelectedStartDate(startStr);
    setSelectedEndDate(endStr);
    openModal();
  };

  const handleSaveEvent = (formData: EventFormData) => {
    const titleVal =
      formData.title.trim() || (selectedEvent ? "Event" : "New Event");
    const startDateVal = formData.start;
    const endDateVal = formData.end || startDateVal;
    const levelVal = formData.level || "Primary";

    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          String(ev.id) === String(selectedEvent.id)
            ? {
                ...ev,
                title: titleVal,
                start: startDateVal,
                end: endDateVal || startDateVal,
                extendedProps: { calendar: levelVal },
              }
            : ev,
        ),
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: titleVal,
        start: startDateVal,
        end: endDateVal || startDateVal,
        allDay: true,
        extendedProps: { calendar: levelVal },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const frameId = requestAnimationFrame(() => {
      const el = calendarContainerRef.current?.querySelector(
        ".ta-toolbar-section:last-child",
      );
      if (el) {
        setPortalNode(el);
      }
    });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", checkMobile);
    };
  }, [isRtlLayout]);

  return (
    <div
      className="overflow-hidden rounded-card border border-line bg-card"
      data-color-scheme={theme}
    >
      <div
        className={`custom-calendar relative ${currentView === "multiMonthYear" ? "fc-multimonth" : ""}`}
        data-color-scheme={theme}
        ref={calendarContainerRef}
      >
        <FullCalendar
          key={isRtlLayout ? "rtl" : "ltr"}
          ref={calendarRef}
          className="gap-0!"
          plugins={[
            themePlugin,
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            multiMonthPlugin,
          ]}
          initialView="dayGridMonth"
          direction={isRtlLayout ? "rtl" : "ltr"}
          // Toolbar Header configuration
          headerToolbar={{
            start: "prev,next addEventButton",
            center: "title",
            end: "",
          }}
          headerToolbarClass="sticky top-0! z-20! bg-card flex-wrap! flex-row! items-center justify-between gap-3 sm:gap-4 [padding-inline:16px]! sm:[padding-inline:24px]! pt-4 sm:pt-6 pb-3 sm:pb-4"
          toolbarTitleClass="text-fx-17! sm:text-fx-20! font-medium! text-ink"
          toolbarSectionClass={(info: ToolbarSectionInfo) => {
            if (info.name === "start") {
              return "ta-toolbar-section ta-toolbar-start order-2 flex w-full items-center justify-between sm:order-1 sm:w-auto sm:justify-start gap-2";
            }
            if (info.name === "center") {
              return "ta-toolbar-section ta-toolbar-center order-1 flex items-center justify-start sm:order-2 sm:justify-center";
            }
            if (info.name === "end") {
              return "ta-toolbar-section ta-toolbar-end order-1 flex items-center justify-end sm:order-3 sm:justify-end";
            }
            return "ta-toolbar-section";
          }}
          buttonGroupClass="gap-2"
          buttons={{
            prev: {
              iconContent: () => (
                <ChevronLeftIcon className="size-5 bg-transparent text-ink sm:size-6 rtl:rotate-180" />
              ),
              className:
                "flex size-9! sm:size-10! p-0! items-center justify-center! rounded-field! border! bg-transparent! border-line! text-ink hover:border-line hover:bg-tile! active:border-line! active:bg-transparent!",
            },
            next: {
              iconContent: () => (
                <ChevronRightIcon className="size-5 bg-transparent text-ink sm:size-6 rtl:rotate-180" />
              ),
              className:
                "flex size-9! sm:size-10! p-0! items-center justify-center! rounded-field! border! bg-transparent! border-line! text-ink hover:border-line hover:bg-tile! active:border-line! active:bg-transparent!",
            },
            addEventButton: {
              text: "Add Event +",
              click: () => handleOpenAddModal(),
              className:
                "rounded-full! border-0! bg-dark! px-[20px]! py-2! sm:py-2.5! text-fx-15! font-medium! text-on-dark! hover:opacity-95! w-auto!",
            },
          }}
          // View configurations
          views={{
            multiMonthYear: {
              multiMonthMaxColumns: 3,
              singleMonthClass: "fc-multimonth",
              tableClass:
                "overflow-visible! border-0! sm:border! sm:border-line! rounded-none! sm:rounded-field! mt-0! bg-transparent!",
              singleMonthHeaderClass: "mb-0!",
              tableHeaderClass:
                "mb-0! rounded-none! sm:rounded-t-[14px]! bg-tile",
              tableBodyClass: "mt-0!",
              singleMonthMinWidth: 280,
              showNonCurrentDates: true,
              singleMonthHeaderInnerClass:
                "text-fx-15 font-medium! text-ink",
              dayHeaderRowClass: "fc-multimonth-day-header-row",
              dayHeaderClass: (data: DayHeaderInfo) =>
                data.inPopover
                  ? "relative! border-b! border-line! bg-tile/70! px-4! py-3! text-start!"
                  : "border-0! bg-tile py-2! first:rounded-none! first:sm:rounded-ss-[14px]! last:rounded-none! last:sm:rounded-se-[14px]!",
              dayHeaderInnerClass: (data: DayHeaderInfo) =>
                data.inPopover
                  ? "text-fx-15! font-medium! text-ink!"
                  : "py-1 text-fx-11 sm:text-fx-14 font-medium text-muted uppercase",
              dayCellClass: (data: DayCellInfo) => {
                if (data.inPopover) return "bg-transparent! p-3!";
                let cls = "relative! p-0.5 sm:p-1!";
                if (data.isToday)
                  cls +=
                    "isolate rounded-chip! bg-tile! font-medium text-orange";
                if (data.isOther) cls += "bg-transparent!";
                return cls;
              },
              dayCellInnerClass: (data: DayCellInfo) =>
                data.inPopover
                  ? "flex custom-scrollbar max-h-60 flex-col gap-1.5 overflow-y-auto"
                  : "h-0 max-h-0 overflow-hidden invisible",
              dayCellTopInnerClass:
                "text-fx-14! sm:text-fx-15! text-ink",
              dayMaxEvents: 0,
              moreLinkClass:
                "border-0! bg-transparent! p-0! hover:bg-transparent! focus:outline-none",
              rowMoreLinkClass:
                "absolute! -top-0.5! sm:-top-1! start-0.5! z-10! border-0! bg-transparent! p-0!",
              rowMoreLinkInnerClass: "overflow-visible!",
              moreLinkContent() {
                return (
                  <span>
                    <BookmarkIcon className="size-4.5 text-orange sm:size-5.5" />
                  </span>
                );
              },
            },
            dayGridMonth: {
              dayMaxEvents: isMobile ? 0 : 2,
              dayHeaderAlign: (data: { inPopover: boolean }) =>
                data.inPopover ? "start" : "center",
              dayHeaderClass: (data: DayHeaderInfo) =>
                data.inPopover
                  ? "relative! border-b! border-line! bg-tile/70! px-4! py-3! text-start!"
                  : "border-x-0! border-t border-line! bg-tile",
              dayHeaderInnerClass: (data: DayHeaderInfo) =>
                data.inPopover
                  ? "text-fx-15! font-medium! text-ink!"
                  : "px-1! py-2! sm:px-3! sm:py-3! md:px-5! md:py-4! text-fx-14! sm:text-fx-15! font-medium! text-muted uppercase",
              dayCellClass: (data: DayCellInfo) => {
                if (data.inPopover) return "bg-transparent! p-3!";
                return `bg-transparent! p-1! sm:p-2! ${ data.isToday ? "bg-tile!" : "" }`;
              },
              dayCellTopInnerClass:
                "text-fx-14! sm:text-fx-15! text-ink",
              dayCellInnerClass: (data: DayCellInfo) => {
                if (data.inPopover)
                  return "flex custom-scrollbar max-h-60 flex-col gap-1.5 overflow-y-auto";
                if (isMobile) return "h-0 max-h-0 overflow-hidden invisible";
                return data.isToday ? "rounded-chip!" : "";
              },
              rowMoreLinkClass: isMobile
                ? "absolute! -top-1! -start-0.5! z-10! border-0! bg-transparent! p-0!"
                : "",
              rowMoreLinkInnerClass: isMobile ? "overflow-visible!" : "",
              moreLinkClass:
                "border-0! bg-transparent! p-0! hover:bg-transparent! focus:outline-none",
              moreLinkContent(args: MoreLinkInfo) {
                if (isMobile) {
                  return (
                    <span>
                      <BookmarkIcon className="size-4.5 text-orange sm:size-5.5" />
                    </span>
                  );
                }
                return (
                  <span className="fc-more-link-badge inline-flex items-center rounded-chip bg-tile px-1 py-0.5 text-fx-10 font-medium text-orange transition-colors hover:bg-tile sm:px-1.5 sm:text-fx-14">
                    +{args.num} more
                  </span>
                );
              },
            },
            timeGridWeek: {
              slotDuration: "01:00:00",
              slotMinHeight: 56,
              allDaySlot: true,
              dayMaxEvents: isMobile ? 0 : undefined,
              moreLinkClass:
                "border-0! bg-transparent! p-0! hover:bg-transparent! focus:outline-none",
              rowMoreLinkClass: isMobile
                ? "absolute! -top-1! -start-0.5! z-10! border-0! bg-transparent! p-0!"
                : "",
              rowMoreLinkInnerClass: isMobile ? "overflow-visible!" : "",
              moreLinkContent: isMobile
                ? () => (
                    <span>
                      <BookmarkIcon className="size-4.5 text-orange sm:size-5.5" />
                    </span>
                  )
                : undefined,
              dayHeaderContent: (arg: DayHeaderInfo) => {
                const weekday = new Intl.DateTimeFormat(locale, {
                  weekday: "short",
                })
                  .format(arg.date)
                  .toUpperCase();
                const day = new Intl.DateTimeFormat(locale, {
                  day: "numeric",
                }).format(arg.date);
                return `${weekday} - ${day}`;
              },
              dayHeaderClass: (data: DayHeaderInfo) =>
                `border-0! bg-tile! ${ data.isToday ? "bg-tile/70!" : "" }`,
              dayHeaderInnerClass: (data: DayHeaderInfo) =>
                `px-1.5! sm:px-3! py-2.5! sm:py-3.5! text-center! text-fx-11! sm:text-fx-14! font-medium! text-secondary! uppercase! ${ data.isToday ? "font-medium! text-orange!" : "" }`,
              slotHeaderDividerClass:
                "border-e! border-s-0! border-y-0! border-line!",
              slotHeaderClass:
                "px-1.5! sm:px-3! py-1.5! sm:py-2! text-start! text-fx-11! sm:text-fx-14! font-medium! text-muted!",
              slotLaneClass: "border-line!",
              dayLaneClass: (data: DayLaneInfo) =>
                `border-line! ${ data.isToday ? "bg-tile/15!" : "" }`,
              allDayDividerClass:
                "border-b! border-t-0! border-x-0! border-line! p-0! bg-transparent!",
              allDayHeaderClass:
                "border-0! bg-tile! text-fx-11! sm:text-fx-14! font-medium! text-secondary!",
            },
            timeGridDay: {
              slotDuration: "00:30:00",
              slotMinHeight: 48,
              allDaySlot: true,
              dayMaxEvents: isMobile ? 0 : undefined,
              moreLinkClass:
                "border-0! bg-transparent! p-0! hover:bg-transparent! focus:outline-none",
              rowMoreLinkClass: isMobile
                ? "absolute! -top-1! -start-0.5! z-10! border-0! bg-transparent! p-0!"
                : "",
              rowMoreLinkInnerClass: isMobile ? "overflow-visible!" : "",
              moreLinkContent: isMobile
                ? () => (
                    <span>
                      <BookmarkIcon className="size-4.5 text-orange sm:size-5.5" />
                    </span>
                  )
                : undefined,
              dayHeaderContent: (arg: DayHeaderInfo) => {
                const weekday = new Intl.DateTimeFormat(locale, {
                  weekday: "short",
                })
                  .format(arg.date)
                  .toUpperCase();
                const day = new Intl.DateTimeFormat(locale, {
                  day: "numeric",
                }).format(arg.date);
                return `${weekday} - ${day}`;
              },
              dayHeaderClass: (data: DayHeaderInfo) =>
                `border-0! bg-tile! ${ data.isToday ? "bg-tile/70!" : "" }`,
              dayHeaderInnerClass: (data: DayHeaderInfo) =>
                `px-2! sm:px-4! py-2.5! sm:py-3.5! text-center! text-fx-14! font-medium! text-secondary! uppercase! ${ data.isToday ? "font-medium! text-orange!" : "" }`,
              slotHeaderDividerClass:
                "border-e! border-s-0! border-y-0! border-line!",
              slotHeaderClass:
                "px-2! sm:px-3! py-1.5! sm:py-2! text-start! text-fx-11! sm:text-fx-14! font-medium! text-muted!",
              slotLaneClass: "border-line!",
              dayLaneClass: (data: DayLaneInfo) =>
                `border-line! ${ data.isToday ? "bg-tile/15!" : "" }`,
              allDayDividerClass:
                "border-b! border-t-0! border-x-0! border-line! p-0! bg-transparent!",
              allDayHeaderClass:
                "border-0! bg-tile! text-fx-14! font-medium! text-secondary!",
            },
          }}
          // Body configuration
          height="auto"
          borderless={true}
          viewClass="border-t! border-b-0! border-x-0! border-line! bg-transparent!"
          tableHeaderClass="border-0! bg-tile!"
          dayHeaderDividerClass="border-b! border-t-0! border-x-0! border-line! p-0! bg-transparent!"
          slotMinHeight={56}
          slotHeaderDividerClass="border-e! border-s-0! border-y-0! border-line!"
          allDayDividerClass="border-b! border-t-0! border-x-0! border-line! p-0! bg-transparent!"
          eventClass=""
          nowIndicator={false}
          columnEventClass="bg-transparent! border-0! p-1! focus:outline-none"
          columnEventInnerClass="p-0! border-0! bg-transparent! h-full"
          tableHeaderSticky={true}
          tableClass="overflow-hidden bg-transparent!"
          rowEventClass="bg-transparent! border-0! px-1! py-0.5! focus:outline-none"
          rowEventInnerClass="p-0! border-0! bg-transparent!"
          popoverFormat={{ month: "short", day: "numeric", year: "numeric" }}
          popoverClass="z-99999! w-72 max-w-[calc(100vw-32px)] overflow-hidden rounded-card border border-line bg-card"
          popoverCloseClass="absolute end-3 top-2.5 flex size-7 cursor-pointer items-center justify-center rounded-field text-muted transition-colors hover:bg-tile hover:text-secondary focus:outline-none"
          popoverCloseContent={() => <CloseIcon className="size-4" />}
          datesSet={(arg) => {
            setCurrentView(arg.view.type);
            requestAnimationFrame(() => {
              const chunk = calendarContainerRef.current?.querySelector(
                ".ta-toolbar-section:last-child",
              );
              if (chunk) {
                setPortalNode(chunk);
              }
            });
          }}
          selectable={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={(eventInfo: EventDisplayInfo) => (
            <CalendarEventItem eventInfo={eventInfo} />
          )}
        />

        <CalendarViewSelect
          currentView={currentView}
          onViewChange={handleViewChange}
          portalNode={portalNode}
        />
      </div>

      <CalendarEventModal
        isOpen={isOpen}
        onClose={closeModal}
        selectedEvent={selectedEvent}
        initialStartDate={selectedStartDate}
        initialEndDate={selectedEndDate}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default Calendar;
