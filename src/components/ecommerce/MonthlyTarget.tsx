"use client";

import { MoreDotIcon } from "@/icons";
import { ArrowDown as IconArrowDown, ArrowUp as IconArrowUp } from "lucide-react";
import { ApexOptions } from "apexcharts";
import { useTranslations } from "next-intl";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { chartFontFamily } from "@/lib/fonts";

import dynamic from "next/dynamic";
import { useState } from "react";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("ecommerce.monthlyTarget");
  const tCommon = useTranslations("common");

  const series = [75.55];
  const options: ApexOptions = {
    colors: ["#D31212"],
    chart: {
      fontFamily: chartFontFamily,
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#EEEEEE",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -35,
            color: "#1A1A1A",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#D31212"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="rounded-card border border-line bg-tile">
      <div className="rounded-card bg-card px-5 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-11">
        <div className="flex justify-between">
          <div>
            <h3 className="text-fx-20 font-medium text-ink">
              {t("title")}
            </h3>
            <p className="mt-1 text-fx-15 font-normal text-secondary">
              {t("subtitle")}
            </p>
          </div>

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
                className="flex w-full rounded-field text-start font-normal text-secondary hover:bg-tile hover:text-ink"
              >
                {tCommon("viewMore")}
              </DropdownItem>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full rounded-field text-start font-normal text-secondary hover:bg-tile hover:text-ink"
              >
                {tCommon("delete")}
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-45 overflow-hidden" id="chartDarkStyle">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-green-soft px-3 py-1 text-fx-14 font-medium text-green">
            +10%
          </span>
        </div>
        <p className="mx-auto mt-4.5 w-full max-w-95 text-center text-fx-15 text-secondary sm:text-fx-17">
          {t("earned", { amount: "$3287" })}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-fx-14 text-secondary sm:text-fx-15">
            {t("target")}
          </p>
          <p className="flex items-center justify-center gap-1 text-fx-17 font-medium text-ink sm:text-fx-20">
            $20K
            <IconArrowDown size={16} className="text-red" />
          </p>
        </div>

        <div className="h-7 w-px bg-icon"></div>

        <div>
          <p className="mb-1 text-center text-fx-14 text-secondary sm:text-fx-15">
            {t("revenue")}
          </p>
          <p className="flex items-center justify-center gap-1 text-fx-17 font-medium text-ink sm:text-fx-20">
            $20K
            <IconArrowUp size={16} className="text-green" />
          </p>
        </div>

        <div className="h-7 w-px bg-icon"></div>

        <div>
          <p className="mb-1 text-center text-fx-14 text-secondary sm:text-fx-15">
            {t("today")}
          </p>
          <p className="flex items-center justify-center gap-1 text-fx-17 font-medium text-ink sm:text-fx-20">
            $20K
            <IconArrowUp size={16} className="text-green" />
          </p>
        </div>
      </div>
    </div>
  );
}
