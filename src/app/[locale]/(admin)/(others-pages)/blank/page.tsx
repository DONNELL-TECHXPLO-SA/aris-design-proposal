import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Blank Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Blank Page TailAdmin Dashboard Template",
};

export default function BlankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Blank Page" />
      <div className="min-h-screen rounded-card border border-line bg-card px-5 py-7 xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 text-fx-20 font-medium text-ink sm:text-fx-24">
            Card Title Here
          </h3>
          <p className="text-fx-15 text-secondary sm:text-fx-17">
            Start putting content on grids or panels, you can also use different
            combinations of grids.Please check out the dashboard and other pages
          </p>
        </div>
      </div>
    </div>
  );
}
