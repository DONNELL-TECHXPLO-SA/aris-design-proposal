import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import Wordmark from "@/components/common/Wordmark";

import { ThemeProvider } from "@/context/ThemeContext";
import Link from "next/link";
import React from "react";

// Finexy auth shell: #EBEBEB page, #F5F5F5 frame (radius 40px, 25px inset). The form
// sits in a white card on one half; the brand panel is the textured #1E1E1C card
// (radius 24px) holding the logo pill and tagline.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page sm:p-[12px] lg:p-[24px] 3xl:px-[100px] 3xl:py-[110px]">
      <ThemeProvider>
        <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col gap-[25px] bg-frame p-[16px] sm:min-h-[calc(100dvh-24px)] sm:rounded-frame md:p-[25px] lg:min-h-[calc(100dvh-48px)] lg:flex-row 3xl:min-h-[calc(100dvh-220px)]">
          {children}
          <div className="dark-card-texture relative hidden overflow-hidden rounded-card lg:flex lg:w-1/2 lg:items-center lg:justify-center">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="relative z-10 flex max-w-[360px] flex-col items-center p-[25px]">
              <Link href="/" className="mb-[25px] flex h-[70px] items-center rounded-full bg-white/10 ps-[10px] pe-[22px]">
                <Wordmark tone="inverted" />
              </Link>
              <p className="text-center text-fx-17 text-white/70">
                Digitising lodgement, tracking, documents, and settlement for every
                claim, in one place.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed end-[24px] bottom-[24px] z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </ThemeProvider>
    </div>
  );
}
