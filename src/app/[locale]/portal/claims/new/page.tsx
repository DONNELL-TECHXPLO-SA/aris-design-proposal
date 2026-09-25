"use client";

import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { PageHeader } from "@/components/ui/finexy";
import StepProgress from "@/components/ui/step-progress/StepProgress";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { findClient } from "@/lib/mock/helpers";
import { useData } from "@/lib/mock/store";
import { useMemo, useState } from "react";

const LATE_REPORT_DAYS = 30;

// Client self-service submission — ux-blueprint.md §15's own 5-step design: Policy/
// Section → Asset (conditional, progressive disclosure) → Loss Details → Attachments →
// Review & Submit, with the late-reporting warning surfaced on Review, not after submit.
export default function ClientNewClaimPage() {
  const { currentUser } = useAuth();
  const { state, submitClaim, uploadDocument } = useData();
  const router = useRouter();

  const client = findClient(state, currentUser?.clientId);
  const policies = useMemo(() => state.policies.filter((p) => p.clientId === client?.id), [state.policies, client]);

  const [policyId, setPolicyId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [claimType, setClaimType] = useState("");
  const [dateOfLoss, setDateOfLoss] = useState("");
  const [location, setLocation] = useState("");
  const [narrative, setNarrative] = useState("");
  const [photoNames, setPhotoNames] = useState<string[]>([]);

  const policy = policies.find((p) => p.id === policyId);
  const sections = policy?.sections ?? [];
  const section = sections.find((s) => s.id === sectionId);
  const assets = useMemo(() => (section ? state.assets.filter((a) => a.sectionId === section.id) : []), [state.assets, section]);
  const needsAsset = !!section?.requiresAsset;

  const steps = [
    { key: "policy", label: "Policy & Section" },
    ...(needsAsset ? [{ key: "asset", label: "Asset" }] : []),
    { key: "loss", label: "Loss Details" },
    { key: "attachments", label: "Attachments" },
    { key: "review", label: "Review & Submit" },
  ];
  const [stepIndex, setStepIndex] = useState(0);
  const currentKey = steps[stepIndex]?.key;

  if (!currentUser || !client) return null;

  // eslint-disable-next-line react-hooks/purity -- a Review-step "is this late?" check against the current moment is fine outside the compiler
  const isLate = dateOfLoss ? (Date.now() - new Date(dateOfLoss).getTime()) / (1000 * 60 * 60 * 24) > LATE_REPORT_DAYS : false;

  const canAdvance =
    (currentKey === "policy" && !!sectionId) ||
    (currentKey === "asset" && !!assetId) ||
    (currentKey === "loss" && !!claimType && !!dateOfLoss && !!location && !!narrative) ||
    currentKey === "attachments" ||
    currentKey === "review";

  function next() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }
  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleSubmit() {
    if (!currentUser) return;
    const id = submitClaim({
      clientId: client!.id,
      policyId,
      sectionId,
      assetId: assetId || undefined,
      claimType,
      dateOfLoss: new Date(dateOfLoss).toISOString(),
      location,
      narrative,
      lodgementChannel: "self_service",
      lodgedById: currentUser.id,
      brokerId: client!.brokerId,
      actorRole: currentUser.role,
    });
    photoNames.forEach((filename) =>
      uploadDocument({ claimId: id, docType: "photo", filename, uploadedById: currentUser.id, actorRole: currentUser.role }),
    );
    router.push(`/portal/claims/${id}/claim-form`);
  }

  return (
    <div>
      <PageHeader title="New Claim" />
      <div className="mb-[25px] rounded-card bg-card p-[20px] md:p-[25px]">
        <StepProgress steps={steps} currentIndex={stepIndex} onStepClick={setStepIndex} />
      </div>

      <div className="rounded-card bg-card p-[20px] md:p-[25px]">
        {currentKey === "policy" && (
          <div className="space-y-[20px]">
            <div>
              <Label>Policy</Label>
              <Select options={policies.map((p) => ({ value: p.id, label: p.policyNumber }))} placeholder="Select your policy" onChange={(v) => { setPolicyId(v); setSectionId(""); setAssetId(""); }} />
            </div>
            <div>
              <Label>Section</Label>
              <Select key={policyId} options={sections.map((s) => ({ value: s.id, label: `${s.name} — ${s.insurer}` }))} placeholder={policyId ? "Select a section" : "Select a policy first"} onChange={(v) => { setSectionId(v); setAssetId(""); }} />
            </div>
            {policies.length === 0 && (
              <Alert variant="info" title="No policy on file" message="We don't have an active policy on file for your organisation yet. Please contact your Broker." />
            )}
          </div>
        )}

        {currentKey === "asset" && (
          <div>
            <Label>
              Which asset was affected? <span className="text-red">*</span>
            </Label>
            <Select options={assets.map((a) => ({ value: a.id, label: a.description }))} placeholder="Select the affected asset" onChange={setAssetId} />
            <p className="mt-[6px] text-fx-14 text-secondary">Only assets on your asset register under this section are shown.</p>
          </div>
        )}

        {currentKey === "loss" && (
          <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
            <div>
              <Label>
                Claim Type <span className="text-red">*</span>
              </Label>
              <Input placeholder="e.g. Motor Accident" value={claimType} onChange={(e) => setClaimType(e.target.value)} />
            </div>
            <div>
              <Label>
                Date of Loss <span className="text-red">*</span>
              </Label>
              <Input type="date" value={dateOfLoss} onChange={(e) => setDateOfLoss(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>
                Location <span className="text-red">*</span>
              </Label>
              <Input placeholder="Where did this happen?" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>
                Narrative <span className="text-red">*</span>
              </Label>
              <TextArea rows={4} placeholder="Describe what happened" value={narrative} onChange={setNarrative} />
            </div>
          </div>
        )}

        {currentKey === "attachments" && (
          <div>
            <Label>Photographs / Reports (optional)</Label>
            <input
              type="file"
              multiple
              onChange={(e) => setPhotoNames(Array.from(e.target.files ?? []).map((f) => f.name))}
              className="block w-full cursor-pointer overflow-hidden rounded-field border border-line bg-card ps-[6px] py-[6px] text-fx-17 text-secondary outline-none file:me-[14px] file:h-[40px] file:cursor-pointer file:rounded-full file:border-0 file:bg-tile file:px-[18px] file:text-fx-15 file:font-medium file:text-ink hover:file:bg-hover"
            />
            {photoNames.length > 0 && (
              <ul className="mt-[10px] list-inside list-disc text-fx-15 text-secondary">
                {photoNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {currentKey === "review" && (
          <div className="space-y-[20px]">
            {isLate && (
              <Alert
                variant="warning"
                title="Late Reported"
                message="This loss was more than 30 days ago. The Insurer may reject the claim on this basis — you can still submit."
              />
            )}
            <dl className="grid grid-cols-1 gap-x-[20px] gap-y-[16px] rounded-tile bg-tile p-[20px] sm:grid-cols-2">
              <div>
                <dt className="text-fx-15 text-secondary">Section</dt>
                <dd className="mt-[2px] text-fx-17 break-words text-ink">{section?.name} — {section?.insurer}</dd>
              </div>
              {assetId && (
                <div>
                  <dt className="text-fx-15 text-secondary">Asset</dt>
                  <dd className="mt-[2px] text-fx-17 break-words text-ink">{assets.find((a) => a.id === assetId)?.description}</dd>
                </div>
              )}
              <div>
                <dt className="text-fx-15 text-secondary">Claim Type</dt>
                <dd className="mt-[2px] text-fx-17 break-words text-ink">{claimType}</dd>
              </div>
              <div>
                <dt className="text-fx-15 text-secondary">Date of Loss</dt>
                <dd className="mt-[2px] text-fx-17 break-words text-ink">{dateOfLoss}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-fx-15 text-secondary">Location</dt>
                <dd className="mt-[2px] text-fx-17 break-words text-ink">{location}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-fx-15 text-secondary">Narrative</dt>
                <dd className="mt-[2px] text-fx-17 break-words text-ink">{narrative}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mt-[25px] flex justify-between gap-[15px]">
          <Button variant="outline" onClick={back} disabled={stepIndex === 0}>
            Back
          </Button>
          {currentKey === "review" ? (
            <Button onClick={handleSubmit}>
              Submit Claim
            </Button>
          ) : (
            <Button onClick={next} disabled={!canAdvance}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
