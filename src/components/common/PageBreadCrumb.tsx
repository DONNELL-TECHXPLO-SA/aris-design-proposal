import { PageHeader } from "@/components/ui/finexy";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import type React from "react";

interface BreadcrumbProps {
  pageTitle: string;
  /** Optional line under the breadcrumb trail (e.g. "sorted by what needs attention"). */
  description?: React.ReactNode;
  /** Optional page-level actions (pill buttons) aligned to the header. */
  actions?: React.ReactNode;
}

// Finexy page header: the page title at 52px/500 with the breadcrumb trail as the
// 20px grey subtitle underneath.
const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, description, actions }) => {
  return (
    <PageHeader
      title={pageTitle}
      actions={actions}
      subtitle={
        <>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-[6px]">
              <li>
                <Link className="inline-flex items-center gap-[6px] hover:text-ink" href="/">
                  Home
                  <ChevronRight className="rtl:rotate-180" size={18} strokeWidth={1.5} />
                </Link>
              </li>
              <li className="text-ink">{pageTitle}</li>
            </ol>
          </nav>
          {description && <p className="mt-[6px]">{description}</p>}
        </>
      }
    />
  );
};

export default PageBreadcrumb;
