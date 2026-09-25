import { LogOut as IconLogout, Trash2 as IconTrash } from "lucide-react";
export default function DangerZone() {
  return (
    <div className="mb-6 rounded-card border border-line bg-card p-5 lg:p-6">
      <h4 className="mb-4 text-fx-20 font-medium text-ink lg:mb-6">
        Danger Zone
      </h4>
      <div>
        <div className="flex flex-col justify-between gap-4 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-end">
          <div>
            <span className="mb-1 block text-fx-17 font-medium text-ink">
              Logout all devices
            </span>
            <p className="text-fx-15 text-secondary">
              Sign out from every active session.
            </p>
          </div>
          <div>
            <button className="flex h-10 items-center justify-center gap-2 rounded-full bg-tile py-2.5 pe-4 ps-3.5 text-fx-15 font-medium text-ink hover:bg-hover hover:text-ink">
              <IconLogout size={20} className="rtl:-scale-x-100" />
              Logout
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-end">
          <div>
            <span className="mb-1 block text-fx-17 font-medium text-ink">
              Delete account
            </span>
            <p className="text-fx-15 text-secondary">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </div>
          <div>
            <button className="inline-flex h-[44px] cursor-pointer items-center justify-center gap-[8px] rounded-full bg-red-soft px-[20px] text-fx-17 font-medium text-red">
              <IconTrash size={20} />
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
