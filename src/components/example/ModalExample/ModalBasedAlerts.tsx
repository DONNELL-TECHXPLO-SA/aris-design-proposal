"use client";
import ComponentCard from "../../common/ComponentCard";

import { useModal } from "@/hooks/useModal";
import { Modal } from "../../ui/modal";
import { CircleAlert as IconAlertCircle, CircleCheck as IconCircleCheck, Info as IconInfoCircle, X as IconX } from "lucide-react";

export default function ModalBasedAlerts() {
  const successModal = useModal();
  const infoModal = useModal();
  const warningModal = useModal();
  const errorModal = useModal();

  return (
    <ComponentCard title="Modal Based Alerts">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={successModal.openModal}
          className="inline-flex h-[44px] items-center gap-[8px] rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink hover:bg-hover before:size-[7px] before:rounded-full before:bg-green before:content-[\'\']"
        >
          Success Alert
        </button>
        <button
          onClick={infoModal.openModal}
          className="inline-flex h-[44px] items-center gap-[8px] rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink hover:bg-hover before:size-[7px] before:rounded-full before:bg-blue before:content-[\'\']"
        >
          Info Alert
        </button>
        <button
          onClick={warningModal.openModal}
          className="inline-flex h-[44px] items-center gap-[8px] rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink hover:bg-hover before:size-[7px] before:rounded-full before:bg-yellow before:content-[\'\']"
        >
          Warning Alert
        </button>
        <button
          onClick={errorModal.openModal}
          className="inline-flex h-[44px] items-center gap-[8px] rounded-full bg-tile px-[20px] text-fx-17 font-medium text-ink hover:bg-hover before:size-[7px] before:rounded-full before:bg-red before:content-[\'\']"
        >
          Danger Alert
        </button>
      </div>
      {/* Success Modal */}
      <Modal
        isOpen={successModal.isOpen}
        onClose={successModal.closeModal}
        className="max-w-150 p-5 lg:p-10"
      >
        <div className="text-center">
          <div className="relative z-1 mb-7 flex items-center justify-center">
            <svg
              className="fill-green"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                fill=""
                fillOpacity=""
              />
            </svg>

            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <IconCircleCheck size={38} className="text-green" />
            </span>
          </div>
          <h4 className="mb-2 text-fx-24 font-medium text-ink sm:text-fx-24">
            Well Done!
          </h4>
          <p className="text-fx-15 leading-6 text-secondary">
            Lorem ipsum dolor sit amet consectetur. Feugiat ipsum libero tempor
            felis risus nisi non. Quisque eu ut tempor curabitur.
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-3">
            <button
              type="button"
              className="flex h-[44px] w-full items-center justify-center rounded-full bg-dark px-[20px] text-fx-17 font-medium text-on-dark hover:opacity-95 sm:w-auto"
            >
              Okay, Got It
            </button>
          </div>
        </div>
      </Modal>
      {/* Info Modal */}
      <Modal
        isOpen={infoModal.isOpen}
        onClose={infoModal.closeModal}
        className="max-w-150 p-5 lg:p-10"
      >
        <div className="text-center">
          <div className="relative z-1 mb-7 flex items-center justify-center">
            <svg
              className="fill-blue"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                fill=""
                fillOpacity=""
              />
            </svg>

            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <IconInfoCircle size={38} className="text-blue" />
            </span>
          </div>

          <h4 className="mb-2 text-fx-24 font-medium text-ink sm:text-fx-24">
            Information Alert!
          </h4>
          <p className="text-fx-15 leading-6 text-secondary">
            Lorem ipsum dolor sit amet consectetur. Feugiat ipsum libero tempor
            felis risus nisi non. Quisque eu ut tempor curabitur.
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-3">
            <button
              type="button"
              className="flex h-[44px] w-full items-center justify-center rounded-full bg-dark px-[20px] text-fx-17 font-medium text-on-dark hover:opacity-95 sm:w-auto"
            >
              Okay, Got It
            </button>
          </div>
        </div>
      </Modal>
      {/* Warning Modal */}
      <Modal
        isOpen={warningModal.isOpen}
        onClose={warningModal.closeModal}
        className="max-w-150 p-5 lg:p-10"
      >
        <div className="text-center">
          <div className="relative z-1 mb-7 flex items-center justify-center">
            <svg
              className="fill-yellow"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                fill=""
                fillOpacity=""
              />
            </svg>

            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <IconAlertCircle size={38} className="text-orange" />
            </span>
          </div>

          <h4 className="mb-2 text-fx-24 font-medium text-ink sm:text-fx-24">
            Warning Alert!
          </h4>
          <p className="text-fx-15 leading-6 text-secondary">
            Lorem ipsum dolor sit amet consectetur. Feugiat ipsum libero tempor
            felis risus nisi non. Quisque eu ut tempor curabitur.
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-3">
            <button
              type="button"
              className="flex h-[44px] w-full items-center justify-center rounded-full bg-dark px-[20px] text-fx-17 font-medium text-on-dark hover:opacity-95 sm:w-auto"
            >
              Okay, Got It
            </button>
          </div>
        </div>
      </Modal>
      {/* Error Modal */}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={errorModal.closeModal}
        className="max-w-150 p-5 lg:p-10"
      >
        <div className="text-center">
          <div className="relative z-1 mb-7 flex items-center justify-center">
            <svg
              className="fill-red"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                fill=""
                fillOpacity=""
              />
            </svg>

            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <IconX size={38} className="text-red" />
            </span>
          </div>

          <h4 className="mb-2 text-fx-24 font-medium text-ink sm:text-fx-24">
            Danger Alert!
          </h4>
          <p className="text-fx-15 leading-6 text-secondary">
            Lorem ipsum dolor sit amet consectetur. Feugiat ipsum libero tempor
            felis risus nisi non. Quisque eu ut tempor curabitur.
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-3">
            <button
              type="button"
              className="flex h-[44px] w-full items-center justify-center rounded-full bg-dark px-[20px] text-fx-17 font-medium text-on-dark hover:opacity-95 sm:w-auto"
            >
              Okay, Got It
            </button>
          </div>
        </div>
      </Modal>
    </ComponentCard>
  );
}
