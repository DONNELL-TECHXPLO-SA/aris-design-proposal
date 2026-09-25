"use client";

import { useState } from "react";
import { Pencil as IconPencil } from "lucide-react";

export default function Security() {
  const [switcherToggle, setSwitcherToggle] = useState(false);

  return (
    <div className="mb-6 rounded-card border border-line bg-card p-5 lg:p-6">
      <h4 className="mb-4 text-fx-20 font-medium text-ink lg:mb-6">
        Security
      </h4>
      <div>
        <div className="flex flex-col justify-between gap-4 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-end">
          <div>
            <span className="mb-1 block text-fx-17 font-medium text-ink">
              Change Password
            </span>
            <p className="text-fx-15 text-secondary">
              Receive real-time notifications and team alerts.
            </p>
          </div>
          <div>
            <button className="flex h-10 items-center justify-center gap-2 rounded-full bg-tile py-2.5 pe-4 ps-3.5 text-fx-15 font-medium text-ink hover:bg-hover hover:text-ink">
              <IconPencil size={20} />
              Change Password
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-end">
          <div>
            <span className="block text-fx-17 font-medium text-ink">
              Two-factor authentication (2FA)
            </span>
            <p className="text-fx-15 text-secondary">
              Keep your account secure by enabling 2FA
            </p>
          </div>
          <div>
            <label
              htmlFor="toggle1"
              className="flex cursor-pointer items-center gap-3 text-fx-15 font-medium text-ink select-none"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggle1"
                  className="sr-only"
                  checked={switcherToggle}
                  onChange={(e) => setSwitcherToggle(e.target.checked)}
                />
                <div
                  className={`block h-5 w-9 rounded-full duration-200 ${ switcherToggle ? "bg-dark" : "bg-icon" }`}
                ></div>
                <div
                  className={`absolute top-0.5 start-0.5 h-4 w-4 rounded-full bg-card duration-200 ease-linear ${ switcherToggle ? "translate-x-full rtl:-translate-x-full" : "translate-x-0" }`}
                ></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
