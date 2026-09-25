"use client";

import { MoreDotIcon } from "@/icons";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import CountryMap from "./CountryMap";

export default function DemographicCard() {
  const t = useTranslations("ecommerce.demographic");
  const tCommon = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="rounded-card border border-line bg-card p-5 sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-fx-20 font-medium text-ink">
            {t("title")}
          </h3>
          <p className="mt-1 text-fx-15 text-secondary">
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
      <div className="border-gary-200 my-6 overflow-hidden rounded-card border bg-tile px-4 py-6 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-53 w-63 2xsm:w-76.75 xsm:w-89.5 sm:-mx-6 md:w-167 lg:w-158.5 xl:w-98.25 2xl:w-138.5"
        >
          <CountryMap />
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-full max-w-8 items-center rounded-full">
              <Image
                width={48}
                height={48}
                src="/images/country/country-01.svg"
                alt="usa"
                className="w-full"
              />
            </div>
            <div>
              <p className="text-fx-15 font-medium text-ink">
                {t("usa")}
              </p>
              <span className="block text-fx-14 text-secondary">
                {t("customers", { count: "2,379" })}
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-35 items-center gap-3">
            <div className="relative block h-2 w-full max-w-25 rounded-chip bg-icon">
              <div className="absolute top-0 left-0 flex h-full w-[79%] items-center justify-center rounded-chip bg-dark text-fx-14 font-medium text-on-dark"></div>
            </div>
            <p className="text-fx-15 font-medium text-ink">
              79%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-full max-w-8 items-center rounded-full">
              <Image
                width={48}
                height={48}
                className="w-full"
                src="/images/country/country-02.svg"
                alt="france"
              />
            </div>
            <div>
              <p className="text-fx-15 font-medium text-ink">
                {t("france")}
              </p>
              <span className="block text-fx-14 text-secondary">
                {t("customers", { count: "589" })}
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-35 items-center gap-3">
            <div className="relative block h-2 w-full max-w-25 rounded-chip bg-icon">
              <div className="absolute top-0 left-0 flex h-full w-[23%] items-center justify-center rounded-chip bg-dark text-fx-14 font-medium text-on-dark"></div>
            </div>
            <p className="text-fx-15 font-medium text-ink">
              23%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
