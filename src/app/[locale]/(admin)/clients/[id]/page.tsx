"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { InfoGrid, Tile } from "@/components/ui/finexy";
import { findUser, formatDate } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useParams } from "next/navigation";

export default function ClientOrganisationPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useData();
  const client = state.clients.find((c) => c.id === id);
  if (!client) return null;

  const primary = findUser(state, client.primaryContactId);
  const secondary = findUser(state, client.secondaryContactId);
  const broker = findUser(state, client.brokerId);

  return (
    <div className="grid grid-cols-1 gap-[25px] lg:grid-cols-2">
      <ComponentCard title="Organisation">
        <Tile>
          <InfoGrid
            items={[
              { label: "Registration Number", value: client.regNo ?? "—" },
              { label: "Address", value: client.address ?? "—" },
              { label: "Assigned Broker", value: broker?.name },
              { label: "Client Since", value: formatDate(client.createdAt) },
            ]}
          />
        </Tile>
      </ComponentCard>

      <ComponentCard title="Contacts" desc="Up to 2 permitted contacts — identical system permissions (Q-009).">
        <Tile className="space-y-[10px]">
          {primary && (
            <div className="rounded-mini bg-card px-[16px] py-[12px]">
              <p className="text-fx-17 font-medium text-ink">{primary.name} — Primary</p>
              <p className="text-fx-15 text-secondary">{primary.email}</p>
            </div>
          )}
          {secondary ? (
            <div className="rounded-mini bg-card px-[16px] py-[12px]">
              <p className="text-fx-17 font-medium text-ink">{secondary.name} — Secondary</p>
              <p className="text-fx-15 text-secondary">{secondary.email}</p>
            </div>
          ) : (
            <p className="text-fx-15 text-secondary">No secondary contact on file.</p>
          )}
        </Tile>
      </ComponentCard>
    </div>
  );
}
