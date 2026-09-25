"use client";

import { useModal } from "@/hooks/useModal";
import { PencilIcon } from "@/icons";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  return (
    <>
      <div className="rounded-card border border-line p-5 lg:p-6">
        <div className="flex flex-col gap-6 sm:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="mb-4 text-fx-20 font-medium text-ink lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  Country
                </p>
                <p className="text-fx-15 font-medium text-ink">
                  United States
                </p>
              </div>

              <div>
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  City/State
                </p>
                <p className="text-fx-15 font-medium text-ink">
                  Phoenix, Arizona, United States.
                </p>
              </div>

              <div>
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  Postal Code
                </p>
                <p className="text-fx-15 font-medium text-ink">
                  ERT 2489
                </p>
              </div>

              <div>
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  TAX ID
                </p>
                <p className="text-fx-15 font-medium text-ink">
                  AS4568384
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={openModal}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-tile px-4 py-3 text-fx-15 font-medium text-ink hover:bg-hover hover:text-ink lg:inline-flex lg:w-auto"
            >
              <PencilIcon className="size-5" />
              Edit
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[700px]">
        <div className="relative no-scrollbar w-full overflow-y-auto rounded-card bg-card p-4 lg:p-11">
          <div className="px-2 pe-14">
            <h4 className="mb-2 text-fx-24 font-medium text-ink">
              Edit Address
            </h4>
            <p className="mb-6 text-fx-15 text-secondary lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar overflow-y-auto px-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input type="text" defaultValue="United States" />
                </div>

                <div>
                  <Label>City/State</Label>
                  <Input type="text" defaultValue="Arizona, United States." />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input type="text" defaultValue="ERT 2489" />
                </div>

                <div>
                  <Label>TAX ID</Label>
                  <Input type="text" defaultValue="AS4568384" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
