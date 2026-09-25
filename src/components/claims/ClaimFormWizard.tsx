"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Radio from "@/components/form/input/Radio";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import StepProgress from "@/components/ui/step-progress/StepProgress";
import { CLAIM_FORM_SCHEMAS } from "@/data/claim-forms";
import type { ClaimField, RepeatingGroup } from "@/data/claim-forms/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { PlusIcon, TrashBinIcon } from "@/icons";
import { buildFilledPdf, sanitizeFilenamePart, triggerDownload } from "@/lib/claim-forms/fillPdf";
import { decodeSavedValues, encodeForSave, type FieldValueMap, type GroupEntries } from "@/lib/claim-forms/groupCodec";
import { computeAllPrefills } from "@/lib/claim-forms/prefill";
import { findClient, findPolicy, findUser } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import type { Claim } from "@/lib/mock/types";
import Script from "next/script";
import { useMemo, useState } from "react";

function FieldInput({
  field,
  value,
  onChange,
  isPrefilled,
}: {
  field: ClaimField;
  value: string | boolean | string[] | undefined;
  onChange: (value: string | boolean | string[]) => void;
  isPrefilled: boolean;
}) {
  if (field.type === "note") {
    return <p className="rounded-tile bg-tile px-[16px] py-[12px] text-fx-14 text-secondary italic">{field.label}</p>;
  }

  const wrap = (children: React.ReactNode) => (
    <div>
      <Label>
        {field.label}
        {field.required && <span className="text-red"> *</span>}
        {isPrefilled && (
          <span className="ms-[8px] inline-flex items-center gap-[6px] rounded-full bg-tile px-[10px] py-[2px] text-fx-12 font-medium text-ink">
            <span className="size-[7px] rounded-full bg-orange" />
            System-filled — review
          </span>
        )}
      </Label>
      {children}
    </div>
  );

  if (field.type === "checkbox") {
    return (
      <div className="flex items-center pt-[4px]">
        <Checkbox label={field.label} checked={!!value} onChange={(checked) => onChange(checked)} />
      </div>
    );
  }

  if (field.type === "choice") {
    const selected = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
    return wrap(
      <div className="flex flex-wrap gap-x-[24px] gap-y-[12px] pt-[4px]">
        {(field.options ?? []).map((opt) =>
          field.multi ? (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={selected.includes(opt.value)}
              onChange={(checked) => onChange(checked ? [...selected, opt.value] : selected.filter((v) => v !== opt.value))}
            />
          ) : (
            <Radio
              key={opt.value}
              id={`${field.id}-${opt.value}`}
              name={field.id}
              value={opt.value}
              checked={selected[0] === opt.value}
              label={opt.label}
              onChange={(v) => onChange(v)}
            />
          ),
        )}
      </div>,
    );
  }

  if (field.type === "signature") {
    return wrap(
      <Input
        placeholder="Type your full name to sign"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="italic"
      />,
    );
  }

  const isMultiline = field.multiline || (field.rows?.length ?? 0) > 1;
  return wrap(
    isMultiline ? (
      <TextArea rows={field.rows?.length ? field.rows.length + 1 : 3} value={(value as string) ?? ""} onChange={onChange} placeholder={field.placeholder} />
    ) : (
      <Input
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        inputMode={field.inputMode as React.HTMLAttributes<HTMLInputElement>["inputMode"]}
      />
    ),
  );
}

function RepeatingGroupBlock({
  group,
  entries,
  onAdd,
  onRemove,
  onSetField,
}: {
  group: RepeatingGroup;
  entries: Record<string, string>[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onSetField: (index: number, subKey: string, value: string) => void;
}) {
  return (
    <div className="rounded-tile bg-tile p-[20px]">
      <div className="mb-[15px] flex flex-wrap items-center justify-between gap-[8px]">
        <p className="text-fx-17 font-medium text-ink">{group.itemLabel}s</p>
        <span className="text-fx-14 text-secondary">
          {entries.length} added{group.fixedSlotCount ? ` · first ${group.fixedSlotCount} print directly on the form` : ""}
        </span>
      </div>
      <div className="space-y-[12px]">
        {entries.map((entry, index) => (
          <div key={index} className="rounded-mini bg-card p-[16px]">
            <div className="mb-[10px] flex items-center justify-between">
              <p className="text-fx-15 font-medium text-ink">
                {group.itemLabel} {index + 1}
              </p>
              <button type="button" onClick={() => onRemove(index)} className="flex size-[32px] items-center justify-center rounded-full bg-row-icon text-muted hover:text-red">
                <TrashBinIcon size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
              {group.subFields.map((sub) => (
                <div key={sub.key}>
                  <Label>{sub.label}</Label>
                  <Input value={entry[sub.key] ?? ""} onChange={(e) => onSetField(index, sub.key, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button size="sm" variant="outline" className="mt-[15px] bg-card! hover:bg-hover!" startIcon={<PlusIcon size={18} />} onClick={onAdd}>
        Add another {group.itemLabel.toLowerCase()}
      </Button>
    </div>
  );
}

export default function ClaimFormWizard({ slug, claim, portal }: { slug: string; claim: Claim; portal: "admin" | "client" }) {
  const schema = CLAIM_FORM_SCHEMAS[slug];
  const { state, saveClaimForm } = useData();
  const { currentUser } = useAuth();
  const router = useRouter();

  const client = findClient(state, claim.clientId);
  const policy = findPolicy(state, claim.policyId);
  const broker = findUser(state, claim.brokerId);

  const prefills = useMemo(
    () => (schema && client ? computeAllPrefills(schema, { client, policy, broker }) : {}),
    [schema, client, policy, broker],
  );
  const saved = useMemo(() => decodeSavedValues(claim.claimFormValues), [claim.claimFormValues]);

  const [values, setValues] = useState<FieldValueMap>(() => ({ ...prefills, ...saved.values }));
  const [groupEntries, setGroupEntries] = useState<GroupEntries>(() => saved.groupEntries);
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pdfReady, setPdfReady] = useState(false);

  if (!schema || !client) {
    return <Alert variant="error" title="Form unavailable" message={`No claim form is configured for "${slug}".`} />;
  }

  const steps = schema.sections.map((s) => ({ key: s.id, label: s.title }));
  const activeSection = schema.sections[stepIndex];
  const fieldsForSection = schema.fields.filter((f) => f.section === activeSection.id);
  const groupsForSection = schema.repeatingGroups.filter((g) => g.section === activeSection.id);
  const isLastStep = stepIndex === steps.length - 1;
  const prefilledIds = new Set(Object.keys(prefills).filter((id) => saved.values[id] === undefined));

  function setValue(id: string, value: string | boolean | string[]) {
    setValues((v) => ({ ...v, [id]: value }));
  }

  async function handleSaveAndDownload(advance: boolean) {
    if (!currentUser || !schema) return;
    if (!window.PDFLib) {
      setError("The PDF engine is still loading — please try again in a moment.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const bytes = await buildFilledPdf(schema, slug, values, groupEntries);
      const nameHint = (schema.filenameField && (values[schema.filenameField] as string)) || client!.name;
      triggerDownload(bytes, `${sanitizeFilenamePart(schema.id)}-${sanitizeFilenamePart(nameHint)}.pdf`);
      saveClaimForm({
        claimId: claim.id,
        values: encodeForSave(values, groupEntries),
        actorId: currentUser.id,
        actorRole: currentUser.role,
      });
      if (advance) {
        const base = portal === "admin" ? `/claims/${claim.id}` : `/portal/claims/${claim.id}`;
        router.push(`${base}/documents`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong generating the PDF.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Script src="/vendor/pdf-lib.min.js" strategy="afterInteractive" onLoad={() => setPdfReady(true)} />

      <div className="mb-[25px] flex flex-wrap items-center justify-between gap-[15px] rounded-card bg-card p-[20px] md:p-[25px]">
        <div className="min-w-0">
          <h1 className="text-fx-24 leading-tight font-medium text-ink">{schema.title}</h1>
          <p className="mt-[4px] text-fx-17 text-secondary">
            {schema.insurer}
            {schema.description ? ` · ${schema.description}` : ""}
          </p>
        </div>
        <Button size="sm" variant="outline" disabled={saving || !pdfReady} onClick={() => handleSaveAndDownload(false)}>
          {pdfReady ? "Download current form" : "Loading PDF engine…"}
        </Button>
      </div>

      {claim.claimFormValues && Object.keys(claim.claimFormValues).length > 0 && (
        <Alert variant="info" title="Previously saved" message="This form was saved before — re-downloading reflects the claim's current data, not a frozen snapshot." />
      )}

      <StepProgress steps={steps} currentIndex={stepIndex} onStepClick={setStepIndex} className="my-[25px] rounded-card bg-card p-[20px] md:p-[25px]" />

      <div className="rounded-card bg-card p-[20px] md:p-[25px]">
        <h2 className="mb-[20px] text-fx-20 leading-tight font-medium text-ink">{activeSection.title}</h2>
        <div className="space-y-[20px]">
          {fieldsForSection.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              value={values[field.id]}
              isPrefilled={prefilledIds.has(field.id)}
              onChange={(v) => setValue(field.id, v)}
            />
          ))}
          {groupsForSection.map((group) => (
            <RepeatingGroupBlock
              key={group.groupKey}
              group={group}
              entries={groupEntries[group.groupKey] ?? []}
              onAdd={() => setGroupEntries((g) => ({ ...g, [group.groupKey]: [...(g[group.groupKey] ?? []), {}] }))}
              onRemove={(index) =>
                setGroupEntries((g) => ({ ...g, [group.groupKey]: (g[group.groupKey] ?? []).filter((_, i) => i !== index) }))
              }
              onSetField={(index, subKey, value) =>
                setGroupEntries((g) => {
                  const list = [...(g[group.groupKey] ?? [])];
                  list[index] = { ...list[index], [subKey]: value };
                  return { ...g, [group.groupKey]: list };
                })
              }
            />
          ))}
          {fieldsForSection.length === 0 && groupsForSection.length === 0 && (
            <p className="rounded-tile bg-tile px-[20px] py-[32px] text-center text-fx-15 text-secondary">No fields in this section.</p>
          )}
        </div>

        {error && <p className="mt-[16px] text-fx-15 text-red">{error}</p>}

        <div className="mt-[25px] flex justify-between gap-[15px]">
          <Button size="sm" variant="outline" onClick={() => setStepIndex((i) => Math.max(0, i - 1))} disabled={stepIndex === 0}>
            Back
          </Button>
          {isLastStep ? (
            <Button size="sm" disabled={saving || !pdfReady} onClick={() => handleSaveAndDownload(true)}>
              {saving ? "Generating…" : "Save & Download"}
            </Button>
          ) : (
            <Button size="sm" onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
