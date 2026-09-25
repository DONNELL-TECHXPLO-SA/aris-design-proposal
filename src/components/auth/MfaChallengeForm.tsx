"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { homeForRole, useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";

// Mock MFA challenge — NFR-01 is mandatory for every role, on every login, across both
// apps. Any 6-digit code passes; this screen exists to make that step visible, not to
// secure anything.
export default function MfaChallengeForm() {
  const { currentUser, mfaVerified, completeMfa, ready } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!currentUser) router.replace("/signin");
    else if (mfaVerified) router.replace(homeForRole(currentUser.role));
  }, [ready, currentUser, mfaVerified, router]);

  if (!ready || !currentUser) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    completeMfa();
    router.push(homeForRole(currentUser!.role));
  }

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto my-auto w-full max-w-[600px] rounded-card bg-card p-[25px] md:p-[40px]">
        <div className="mb-[25px]">
          <h1 className="mb-[14px] text-fx-36 leading-tight font-[500] tracking-[-0.02em] text-ink md:text-fx-52">
            Two-factor verification
          </h1>
          <p className="text-fx-17 text-secondary">
            Signed in as <span className="font-medium text-ink">{currentUser.name}</span>.
            Enter any 6-digit code — this is a prototype, nothing is actually verified.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-[20px]">
            <div>
              <Label>Authentication code</Label>
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                error={!!error}
              />
              {error && <p className="mt-[6px] text-fx-14 text-red">{error}</p>}
            </div>
            <Button className="w-full">
              Verify &amp; continue
            </Button>
          </div>
        </form>
        <p className="mt-[20px] text-center text-fx-15 text-secondary">
          Setting up a new device?{" "}
          <Link href="/mfa-enrol" className="font-medium text-ink underline decoration-sep underline-offset-4 hover:decoration-ink">
            Enrol in MFA
          </Link>
        </p>
      </div>
    </div>
  );
}
