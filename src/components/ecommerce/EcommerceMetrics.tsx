"use client";

import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useTranslations } from "next-intl";
import Badge from "../ui/badge/Badge";

export const EcommerceMetrics = () => {
  const t = useTranslations("ecommerce.metrics");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-card border border-line bg-card p-5 md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-tile bg-tile">
          <GroupIcon className="size-6 text-ink" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-fx-15 text-secondary">
              {t("customers")}
            </span>
            <h4 className="mt-2 text-fx-24 font-medium text-ink">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-card border border-line bg-card p-5 md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-tile bg-tile">
          <BoxIconLine className="text-ink" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-fx-15 text-secondary">
              {t("orders")}
            </span>
            <h4 className="mt-2 text-fx-24 font-medium text-ink">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon className="text-red" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
