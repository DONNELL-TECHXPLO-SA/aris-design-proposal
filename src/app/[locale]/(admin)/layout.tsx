"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

// Finexy shell: #EBEBEB page, one #F5F5F5 app frame (radius 40px, 25px inset) holding
// the floating top-bar pills, the 70px icon sidebar and the content column. At the
// 2000px reference width the frame sits at 100px/110px, exactly like the reference;
// on 1280-1999px desktops the shell is compacted (reference sizes read as zoomed there).
// The frame is locked to the viewport height — the header and sidebar are pinned
// while only the main column scrolls (matches the reference frame, where the sign-out
// pill stays on the frame's bottom edge regardless of content).
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth portal="admin">
      <div className="h-dvh overflow-hidden bg-page sm:p-[12px] lg:p-[24px] xl:p-[16px] 2xl:p-[20px] 3xl:px-[100px] 3xl:py-[110px]">
        <div className="mx-auto flex h-full max-w-[1800px] flex-col bg-frame p-[12px] sm:rounded-frame sm:p-[16px] md:p-[25px] xl:p-[20px] 3xl:p-[25px]">
          <AppHeader />
          <div className="mt-[16px] flex min-h-0 flex-1 gap-[25px] md:mt-[25px] xl:mt-[20px] xl:gap-[20px] 3xl:mt-[40px] 3xl:gap-[25px]">
            <AppSidebar />
            <main className="custom-scrollbar min-w-0 flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
        <Backdrop />
      </div>
    </RequireAuth>
  );
}
