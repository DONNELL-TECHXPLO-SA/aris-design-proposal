"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { buttonClass } from "@/components/ui/button/Button";
import { InfoGrid, PageHeader, Tile } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { findClient } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";

export default function ClientProfilePage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  if (!currentUser) return null;
  const client = findClient(state, currentUser.clientId);

  return (
    <div className="space-y-[25px]">
      <PageHeader title="Profile" />
      <ComponentCard title="Account">
        <Tile>
          <InfoGrid
            items={[
              { label: "Name", value: currentUser.name },
              { label: "Email", value: currentUser.email },
              { label: "Organisation", value: client?.name },
              { label: "Contact Type", value: currentUser.role === "client_primary" ? "Primary" : "Secondary" },
            ]}
          />
        </Tile>
      </ComponentCard>
      <ComponentCard title="Security">
        <p className="text-fx-17 text-secondary">Multi-factor authentication is required on every login.</p>
        <Link href="/mfa-enrol" className={buttonClass("outline", "sm")}>
          Re-enrol a device
        </Link>
      </ComponentCard>
    </div>
  );
}
