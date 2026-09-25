"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import ClientBottomNav from "@/layout/ClientBottomNav";
import ClientTopNav from "@/layout/ClientTopNav";
import React from "react";

// User/Client Portal shell — no sidebar, per ux-blueprint.md §8.4/§10.3: top nav
// (desktop/tablet) doubling as the header, bottom nav (mobile). Lives at a real
// "/portal" path segment (not a route group) because the Admin Portal already owns "/".
// Same Finexy frame as the Admin Portal (#EBEBEB page, #F5F5F5 frame, radius 40px).
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth portal="client">
      <div className="h-dvh overflow-hidden bg-page sm:p-[12px] lg:p-[24px] xl:p-[16px] 2xl:p-[20px] 3xl:px-[100px] 3xl:py-[110px]">
        <div className="mx-auto flex h-full max-w-[1800px] flex-col bg-frame p-[12px] sm:rounded-frame sm:p-[16px] md:p-[25px] xl:p-[20px] 3xl:p-[25px]">
          <ClientTopNav />
          <main className="custom-scrollbar mt-[16px] w-full md:mt-[25px] min-h-0 flex-1 overflow-y-auto pb-[100px] md:pb-0 xl:mt-[20px] 3xl:mt-[40px]">
            {children}
          </main>
        </div>
        <ClientBottomNav />
      </div>
    </RequireAuth>
  );
}
