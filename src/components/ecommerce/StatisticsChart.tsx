"use client";

import { CalenderIcon } from "@/icons";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import ChartTab from "../common/ChartTab";
import { chartFontFamily } from "@/lib/fonts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const monthKeys = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
] as const;

export default function StatisticsChart() {
  const t = useTranslations("ecommerce.statistics");
  const tMonths = useTranslations("ecommerce.months");
  const datePickerRef = useRef<HTMLInputElement>(null);

  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#D31212", "#1E1E1C"], // Define line colors
    chart: {
      fontFamily: chartFontFamily,
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      borderColor: "#DADADA",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: monthKeys.map((key) => tMonths(key)),
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B6B6B"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: t("sales"),
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: t("revenue"),
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6l6 6"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6l-6 6"/></svg>',
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, []);

  return (
    <div className="rounded-card border border-line bg-card px-5 pt-5 pb-5 sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-fx-20 font-medium text-ink">
            {t("title")}
          </h3>
          <p className="mt-1 text-fx-15 text-secondary">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:justify-end">
          <ChartTab />
          <div className="relative inline-flex items-center">
            <CalenderIcon className="pointer-events-none absolute inset-s-1/2 top-1/2 z-10 ms-2 -translate-x-1/2 -translate-y-1/2 text-secondary lg:inset-s-3 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 rtl:translate-x-1/2 lg:rtl:translate-x-0" />
            <input
              ref={datePickerRef}
              className="h-10 w-10 cursor-pointer rounded-field border border-line bg-card text-fx-15 font-medium text-transparent outline-none lg:h-auto lg:w-40 lg:py-2 lg:ps-10 lg:pe-3 lg:text-ink"
              placeholder={t("selectDateRange")}
            />
          </div>
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-250 xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
