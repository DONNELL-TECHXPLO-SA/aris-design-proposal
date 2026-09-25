"use client";

import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "brand" | "error";
}

// Shared confirmation gate for irreversible-by-normal-means actions (recording an
// insurer decision, closing/reopening a claim) — per ux-blueprint.md §3.4/§5.
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "brand",
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] p-[25px]">
      <h3 className="pe-[50px] text-fx-24 leading-tight font-medium text-ink">{title}</h3>
      <p className="mt-[10px] text-fx-17 text-secondary">{description}</p>
      <div className="mt-[25px] flex justify-end gap-[15px]">
        <Button size="sm" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={tone === "error" ? "bg-red! text-white!" : undefined}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
