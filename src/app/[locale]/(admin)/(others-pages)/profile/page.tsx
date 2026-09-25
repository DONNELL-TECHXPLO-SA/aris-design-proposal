import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DangerZone from "@/components/user-profile/DangerZone";
import Security from "@/components/user-profile/Security";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | TailAdmin - Next.js Admin Dashboard Template",
  description:
    "Manage your personal information, security settings, and preference on the TailAdmin Profile page.",
};

export default function Profile() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-card border border-line bg-card p-5 lg:p-6">
        <h3 className="mb-5 text-fx-20 font-medium text-ink lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserAddressCard />
          <Security />
          <DangerZone />
        </div>
      </div>
    </div>
  );
}
