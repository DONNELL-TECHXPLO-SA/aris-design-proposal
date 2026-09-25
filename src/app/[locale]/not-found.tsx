"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// Finexy error page: frame + centred white card, 52px/500 heading, 20px grey text,
// dark pill back home.
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen bg-page sm:p-[12px] lg:p-[24px] 3xl:px-[100px] 3xl:py-[110px]">
      <div className="relative mx-auto flex min-h-screen max-w-[1800px] flex-col items-center justify-center bg-frame p-[16px] sm:min-h-[calc(100dvh-24px)] sm:rounded-frame md:p-[25px] lg:min-h-[calc(100dvh-48px)] 3xl:min-h-[calc(100dvh-220px)]">
        <div className="w-full max-w-[560px] rounded-card bg-card px-[25px] py-[48px] text-center md:px-[40px]">
          <h1 className="text-fx-36 leading-tight font-[500] tracking-[-0.02em] text-ink md:text-fx-52">
            {t("error")}
          </h1>

          <p className="tabular-numbers mt-[14px] text-fx-40 leading-none font-[500] text-orange">404</p>

          <p className="mt-[20px] text-fx-20 text-secondary">{t("message")}</p>

          <Link
            href="/"
            className="mt-[25px] inline-flex h-[57px] items-center justify-center rounded-full bg-dark px-[32px] text-fx-20 font-medium text-on-dark hover:opacity-95"
          >
            {t("backHome")}
          </Link>
        </div>
        {/* <!-- Footer --> */}
        <p className="absolute bottom-[25px] left-1/2 -translate-x-1/2 text-center text-fx-14 text-secondary">
          &copy; {new Date().getFullYear()} - TailAdmin
        </p>
      </div>
    </div>
  );
}
