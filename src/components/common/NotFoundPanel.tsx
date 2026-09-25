import { Link } from "@/i18n/navigation";

/**
 * Inline "not found" state for a scoped record a user isn't allowed to see — reads as
 * "not found," never "forbidden," per ux-blueprint.md §3.5, so an unauthorised user
 * can't tell the record exists. Renders inside the normal portal shell rather than a
 * full-page takeover, since only this one record is missing.
 */
export default function NotFoundPanel({ backHref, backLabel = "Back to Claims" }: { backHref: string; backLabel?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card bg-card px-[25px] py-[64px] text-center">
      <p className="tabular-numbers text-fx-52 leading-tight font-[500] tracking-[-0.02em] text-ink">404</p>
      <p className="mt-[14px] max-w-[520px] text-fx-20 text-secondary">
        We couldn&apos;t find that record. It may not exist, or it may not be available to you.
      </p>
      <Link
        href={backHref}
        className="mt-[25px] inline-flex h-[57px] items-center justify-center rounded-full bg-dark px-[32px] text-fx-20 font-medium text-on-dark"
      >
        {backLabel}
      </Link>
    </div>
  );
}
