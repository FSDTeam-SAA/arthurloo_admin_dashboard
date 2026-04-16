"use client";

import { useState } from "react";
import DashboardOverviewHeader from "../_components/dashboard-overview-header";
import ProfileCard from "./_components/profile-card";
import PersonalInformationForm from "./_components/personal-information-form";
import ChangePasswordForm from "./_components/change-password-form";

type Tab = "personal" | "password";

const PROFILE = {
  name: "Sarah Han",
  email: "sarahhan@gmail.com",
  bio: "Dedicated platform administrator focused on supporting early childhood development through technology. Committed to maintaining a reliable system that helps teachers and parents collaborate effectively while using AI-driven insights to support each child's Individual Development Program (IDP).",
  phone: "+1 (725) 890-4421",
  location: "87 Meadowbrook Drive, Austin, TX 78703",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  return (
    <div>
      <DashboardOverviewHeader
        title="Settings"
        description="Manage your profile"
      />

      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start">
        {/* Left: Profile Card */}
        <div className="w-full lg:w-[280px] lg:shrink-0">
          <ProfileCard {...PROFILE} />
        </div>

        {/* Right: Tabbed Forms */}
        <div className="flex-1 space-y-4">
          {/* Tab switcher */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("personal")}
              className={`rounded-[8px] px-5 py-2 text-sm font-medium transition ${
                activeTab === "personal"
                  ? "bg-primary text-white"
                  : "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6]"
              }`}
            >
              Personal Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={`rounded-[8px] px-5 py-2 text-sm font-medium transition ${
                activeTab === "password"
                  ? "bg-primary text-white"
                  : "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6]"
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Form content */}
          {activeTab === "personal" ? (
            <PersonalInformationForm />
          ) : (
            <ChangePasswordForm />
          )}
        </div>
      </div>
    </div>
  );
}
