import { useTranslations } from "next-intl";

export default function SidebarWidget() {
  const t = useTranslations("sidebar.widget");

  return (
    <div className="pb-20">
      <div
        className="mx-auto rounded-tile bg-tile px-[20px] py-[20px] text-center"
      >
        <h3 className="mb-2 font-medium text-ink">
          {t("title")}
        </h3>
        <p className="mb-4 text-secondary text-fx-15">
          {t("description")}
        </p>
        <a
          href="https://tailadmin.com/pricing"
          target="_blank"
          rel="nofollow"
          className="flex h-[44px] items-center justify-center rounded-full bg-dark px-[20px] text-fx-17 font-medium text-on-dark hover:opacity-95"
        >
          {t("purchasePlan")}
        </a>
      </div>
    </div>
  );
}
