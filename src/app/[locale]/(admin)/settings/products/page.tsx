"use client";

import AdministratorOnly from "@/components/auth/AdministratorOnly";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { CLAIM_FORM_REGISTRY } from "@/data/claim-forms";

// Administrator-only (FR-07): which insurer claim form is configured against which
// Insurer/UMA + claim type. This prototype ships all 17 ClaimFormFiller forms
// pre-registered; a real build would let an Administrator add/replace forms here.
export default function ProductConfigPage() {
  return (
    <AdministratorOnly>
      <PageBreadcrumb pageTitle="Product & Document Configuration" />
      <ComponentCard title="Configured Claim Forms" desc="Every claim's insurer form is determined automatically from its policy section's Insurer/UMA (FR-15) — there is no manual form picker.">
        <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Insurer</TableCell>
                <TableCell isHeader>Form</TableCell>
                <TableCell isHeader>Slug</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CLAIM_FORM_REGISTRY.map((f) => (
                <TableRow key={f.slug}>
                  <TableCell className="whitespace-nowrap">{f.insurer}</TableCell>
                  <TableCell>
                    {f.title}
                    {f.description && <span className="block text-fx-14 text-secondary">{f.description}</span>}
                  </TableCell>
                  <TableCell className="text-fx-15 whitespace-nowrap text-secondary">{f.slug}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </ComponentCard>
    </AdministratorOnly>
  );
}
