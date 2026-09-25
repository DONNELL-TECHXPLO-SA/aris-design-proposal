"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { buttonClass } from "@/components/ui/button/Button";
import { Card, CardHeader, RowIcon, StatusDot } from "@/components/ui/finexy";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "@/icons";
import { findUser } from "@/lib/mock/helpers";
import { canEditClient, useData, useScopedClients } from "@/lib/mock/store";
import { Building2 } from "lucide-react";

export default function ClientsListPage() {
  const { currentUser } = useAuth();
  const { state } = useData();
  const role = currentUser?.role ?? "broker";
  const clients = useScopedClients(role, currentUser?.id ?? "");

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Clients & Policies"
        description="Every client is visible here (§3.3) — you can only edit the ones assigned to you."
        actions={
          (role === "administrator" || role === "manager") && (
            <Link href="/clients/new" className={buttonClass("primary", "sm")}>
              <PlusIcon size={18} />
              New Client
            </Link>
          )
        }
      />
      <Card>
        <CardHeader title="Clients & Policies" />
        <div className="mt-[15px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Client</TableCell>
                <TableCell isHeader>Broker</TableCell>
                <TableCell isHeader>Policies</TableCell>
                <TableCell isHeader>Access</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => {
                const broker = findUser(state, client.brokerId);
                const policyCount = state.policies.filter((p) => p.clientId === client.id).length;
                const editable = canEditClient(role, currentUser?.id ?? "", client);
                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Link href={`/clients/${client.id}`} className="flex items-center gap-[12px] text-ink">
                        <RowIcon>
                          <Building2 size={16} strokeWidth={1.5} />
                        </RowIcon>
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell>{broker?.name}</TableCell>
                    <TableCell className="tabular-numbers">{policyCount}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {editable ? <StatusDot tone="green">Editable</StatusDot> : <StatusDot tone="muted">View only</StatusDot>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
