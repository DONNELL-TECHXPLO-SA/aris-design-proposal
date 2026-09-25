import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Error 404 | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Error 404 page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

// Finexy error page: frame + centred white card, 52px/500 heading, 20px grey text,
// dark pill back home.
export default function Error404() {
  return (
    <div className="min-h-screen bg-page sm:p-[12px] lg:p-[24px] 3xl:px-[100px] 3xl:py-[110px]">
      <div className="relative mx-auto flex min-h-screen max-w-[1800px] flex-col items-center justify-center bg-frame p-[16px] sm:min-h-[calc(100dvh-24px)] sm:rounded-frame md:p-[25px] lg:min-h-[calc(100dvh-48px)] 3xl:min-h-[calc(100dvh-220px)]">
        <div className="w-full max-w-[560px] rounded-card bg-card px-[25px] py-[48px] text-center md:px-[40px]">
          <h1 className="text-fx-36 leading-tight font-[500] tracking-[-0.02em] text-ink md:text-fx-52">
            ERROR
          </h1>

          <p className="tabular-numbers mt-[14px] text-fx-40 leading-none font-[500] text-orange">404</p>

          <p className="mt-[20px] text-fx-20 text-secondary">
            We can’t seem to find the page you are looking for!
          </p>

          <Link
            href="/"
            className="mt-[25px] inline-flex h-[57px] items-center justify-center rounded-full bg-dark px-[32px] text-fx-20 font-medium text-on-dark hover:opacity-95"
          >
            Back to Home Page
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
