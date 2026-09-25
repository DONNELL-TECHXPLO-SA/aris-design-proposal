"use client";
import { PencilIcon } from "@/icons";
import Image from "next/image";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Facebook as IconBrandFacebook, Instagram as IconBrandInstagram, Linkedin as IconBrandLinkedin, Twitter as IconBrandX, Camera as IconCamera } from "lucide-react";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <>
      <div className="mb-6 rounded-card border border-line p-5 lg:p-6">
        <div className="flex flex-col gap-5 sm:flex-row xl:gap-10">
          <div className="flex-1">
            <div className="mb-4 flex flex-col gap-5 sm:flex-row lg:mb-6 xl:items-center xl:justify-between">
              <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center lg:gap-6">
                <div className="overflow-hidden rounded-full border border-line">
                  <Image
                    src="/images/user/owner.png"
                    width={80}
                    height={80}
                    className="size-20"
                    alt="user"
                  />
                </div>
                <div className="text-start">
                  <h4 className="mb-2 text-fx-20 font-medium text-ink">
                    Musharof Chowdhury
                  </h4>
                  <div className="flex items-center gap-1 sm:gap-3">
                    <p className="text-fx-15 text-secondary">
                      Team Manager
                    </p>
                    <div className="hidden h-3.5 w-px bg-icon sm:block"></div>
                    <p className="text-fx-15 text-secondary">
                      Arizona, United States.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-11 xl:gap-y-7">
              <div className="w-full">
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  First Name
                </p>
                <p className="text-fx-15 font-medium text-ink">
                  Chowdury
                </p>
              </div>
              <div className="w-full">
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  Last Name
                </p>
                <p className="text-fx-15 font-medium text-ink">
                  Musharof
                </p>
              </div>
              <div className="hidden xl:block"></div>
              <div className="hidden xl:block"></div>
              <div>
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  Email address
                </p>
                <p className="text-fx-15 font-medium text-ink">
                  randomuser@pimjo.com
                </p>
              </div>
              <div>
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  Phone
                </p>
                <p className="text-fx-15 font-medium text-ink">
                  +09 363 398 46
                </p>
              </div>
              <div>
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  Bio
                </p>
                <p className="text-fx-15 font-medium text-ink">
                  Team Manager
                </p>
              </div>
              <div>
                <p className="mb-2 text-fx-14 leading-normal text-secondary">
                  Social Links
                </p>
                <div className="flex grow items-center gap-4">
                  <a
                    href="#"
                    className="size-5 text-fx-15 font-medium text-ink hover:text-secondary"
                  >
                    <IconBrandFacebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="size-5 text-fx-15 font-medium text-ink hover:text-secondary"
                  >
                    <IconBrandX size={20} />
                  </a>
                  <a
                    href="#"
                    className="size-5 text-fx-15 font-medium text-ink hover:text-secondary"
                  >
                    <IconBrandLinkedin size={20} />
                  </a>
                  <a
                    href="#"
                    className="size-5 text-fx-15 font-medium text-ink hover:text-secondary"
                  >
                    <IconBrandInstagram size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={openModal}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-tile px-4 py-2.5 text-fx-15 font-medium text-ink hover:bg-hover hover:text-ink lg:inline-flex lg:w-auto"
            >
              <PencilIcon className="size-5" />
              Edit
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[700px]">
        <div className="relative no-scrollbar w-full max-w-[700px] overflow-y-auto rounded-card bg-card p-4 lg:p-11">
          <div className="px-2 pe-14">
            <h4 className="mb-2 text-fx-24 font-medium text-ink">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-fx-15 text-secondary lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h4 className="mb-6 text-fx-20 font-medium text-ink">
                  Change Profile Picture
                </h4>
                <div className="mb-6 flex max-w-sm items-center gap-6 lg:pe-5">
                  <div className="relative size-20 shrink-0 rounded-full sm:size-25">
                    <Image
                      src="/images/user/owner.png"
                      alt="Profile Picture"
                      width={100}
                      height={100}
                      className="size-20 rounded-full object-cover sm:size-25"
                    />
                    <label
                      htmlFor="file-upload"
                      className="absolute end-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full border border-line bg-card text-secondary"
                    >
                      <input
                        type="file"
                        name="file-upload"
                        id="file-upload"
                        className="hidden"
                      />
                      <IconCamera size={20} />
                    </label>
                  </div>
                  <div>
                    <p className="text-fx-15 text-secondary">
                      Upload a square image (200×200 px) in JPEG or PNG format.
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-7">
                <h5 className="mb-5 text-fx-20 font-medium text-ink lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input type="text" defaultValue="Musharof" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input type="text" defaultValue="Chowdhury" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="text" defaultValue="randomuser@pimjo.com" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text" defaultValue="+09 363 398 46" />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" defaultValue="Team Manager" />
                  </div>
                </div>
              </div>
              <div>
                <h5 className="mb-5 text-fx-20 font-medium text-ink lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      defaultValue="https://www.facebook.com/PimjoHQ"
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input type="text" defaultValue="https://x.com/PimjoHQ" />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      defaultValue="https://www.linkedin.com/company/pimjo"
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input
                      type="text"
                      defaultValue="https://instagram.com/PimjoHQ"
                    />
                  </div>
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
