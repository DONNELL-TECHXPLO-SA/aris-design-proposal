"use client";

import Button from "@/components/ui/button/Button";
import { homeForRole, useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

// Mock MFA enrolment — triggered per UC-10 whenever a new user is invited. Shown here
// as a standalone reachable screen (Critical tier, §23.3) rather than gated behind a
// real invitation flow, since there's no backend to send one.
export default function MfaEnrolForm() {
  const { currentUser, completeMfa, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !currentUser) router.replace("/signin");
  }, [ready, currentUser, router]);

  if (!ready || !currentUser) return null;

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto my-auto w-full max-w-[600px] rounded-card bg-card p-[25px] md:p-[40px]">
        <div className="mb-[25px]">
          <h1 className="mb-[14px] text-fx-36 leading-tight font-[500] tracking-[-0.02em] text-ink md:text-fx-52">
            Set up multi-factor authentication
          </h1>
          <p className="text-fx-17 text-secondary">
            MFA is required for every account (NFR-01). Scan this code with an
            authenticator app, then confirm below.
          </p>
        </div>
        <div className="mx-auto mb-[25px] flex size-[160px] items-center justify-center rounded-tile bg-tile text-fx-14 text-secondary">
          QR code placeholder
        </div>
        <Button
          className="w-full"
          onClick={() => {
            completeMfa();
            router.push(homeForRole(currentUser.role));
          }}
        >
          I&apos;ve added this account
        </Button>
      </div>
    </div>
  );
}
