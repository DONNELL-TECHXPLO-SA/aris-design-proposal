"use client";

import NotFoundPanel from "@/components/common/NotFoundPanel";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { buttonClass } from "@/components/ui/button/Button";
import { Card, CardHeader, RowIcon } from "@/components/ui/finexy";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "@/icons";
import { useData } from "@/lib/mock/store";
import type { Role } from "@/lib/mock/types";
import { UserRound } from "lucide-react";

const ROLE_LABEL: Record<Role, string> = {
  administrator: "Administrator",
  manager: "Manager",
  broker: "Broker",
  client_primary: "Client — Primary",
  client_secondary: "Client — Secondary",
};

export default function UsersListPage() {
  const { currentUser } = useAuth();
  const { state, setUserActive } = useData();
  const isAdministrator = currentUser?.role === "administrator";
  const canView = isAdministrator || currentUser?.role === "manager";

  if (currentUser && !canView) {
    return <NotFoundPanel backHref="/" backLabel="Back to Dashboard" />;
  }

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Users & Access"
        description={isAdministrator ? "Full account lifecycle and role assignment." : "View-only — account changes are Administrator-only."}
        actions={
          isAdministrator && (
            <Link href="/users/new" className={buttonClass("primary", "sm")}>
              <PlusIcon size={18} />
              New User
            </Link>
          )
        }
      />
      <Card>
        <CardHeader title="Users & Access" />
        <div className="mt-[15px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Name</TableCell>
                <TableCell isHeader>Role</TableCell>
                <TableCell isHeader>Email</TableCell>
                <TableCell isHeader>Status</TableCell>
                {isAdministrator && <TableCell isHeader>Actions</TableCell>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="whitespace-nowrap">
                    <span className="flex items-center gap-[12px]">
                      <RowIcon>
                        <UserRound size={16} strokeWidth={1.5} />
                      </RowIcon>
                      {u.name}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{ROLE_LABEL[u.role]}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge color={u.active ? "success" : "light"}>
                      {u.active ? "Active" : "Deactivated"}
                    </Badge>
                  </TableCell>
                  {isAdministrator && (
                    <TableCell>
                      <button
                        onClick={() => setUserActive(u.id, !u.active)}
                        className="h-[36px] rounded-full bg-tile px-[16px] text-fx-15 font-medium whitespace-nowrap text-ink hover:bg-hover"
                      >
                        {u.active ? "Deactivate" : "Reactivate"}
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
