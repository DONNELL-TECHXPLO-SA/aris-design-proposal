import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ChartTab: React.FC = () => {
  const t = useTranslations("ecommerce.statistics");
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo" | "optionThree"
  >("optionOne");

  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree") =>
    selected === option
      ? "text-ink bg-card"
      : "text-secondary";

  return (
    <div className="flex max-h-10 items-center gap-0.5 rounded-field bg-tile p-0.5">
      <button
        onClick={() => setSelected("optionOne")}
        className={`w-full rounded-chip px-3 py-2 text-fx-15 font-medium hover:text-ink ${getButtonClass( "optionOne", )}`}
      >
        {t("monthly")}
      </button>

      <button
        onClick={() => setSelected("optionTwo")}
        className={cn(
          "w-full rounded-chip px-3 py-1.5 text-fx-15 font-medium hover:text-ink rtl:min-w-20",
          getButtonClass("optionTwo"),
        )}
      >
        {t("quarterly")}
      </button>

      <button
        onClick={() => setSelected("optionThree")}
        className={`w-full rounded-chip px-3 py-2 text-fx-15 font-medium hover:text-ink ${getButtonClass( "optionThree", )}`}
      >
        {t("annually")}
      </button>
    </div>
  );
};

export default ChartTab;
