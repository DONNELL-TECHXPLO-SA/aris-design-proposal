"use client";

import { MoreDotIcon } from "@/icons";
import { ApexOptions } from "apexcharts";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { chartFontFamily } from "@/lib/fonts";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

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

export default function MonthlySalesChart() {
  const t = useTranslations("ecommerce");
  const tCommon = useTranslations("common");
  const options: ApexOptions = {
    colors: ["#1E1E1C"],
    chart: {
      fontFamily: chartFontFamily,
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: 35,
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: monthKeys.map((key) => t(`months.${key}`)),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tickPlacement: "on",
      labels: {
        style: { fontSize: "14px", colors: "#6B6B6B" },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: chartFontFamily,
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      borderColor: "#DADADA",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const series = [
    {
      name: t("monthlySales.series"),
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="overflow-hidden rounded-card border border-line bg-card px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-fx-20 font-medium text-ink">
          {t("monthlySales.title")}
        </h3>
        <div className="relative h-fit">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-muted hover:text-ink" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full rounded-field text-left font-normal text-secondary hover:bg-tile hover:text-ink"
            >
              {tCommon("viewMore")}
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full rounded-field text-left font-normal text-secondary hover:bg-tile hover:text-ink"
            >
              {tCommon("delete")}
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-162.5 pl-2 xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
