"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PersonalInfoValues {
  gender: "male" | "female";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  streetAddress: string;
  location: string;
  postalCode: string;
}

const DEFAULT_VALUES: PersonalInfoValues = {
  gender: "female",
  firstName: "Sarah",
  lastName: "Han",
  email: "sarahhan@gmail.com",
  phone: "+1 (555) 123-4567",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et ante sed sem feugiat tristique at sed mauris. Phasellus urna magna, cursus at mi eu, dapibus porta nisi.",
  streetAddress: "1234 Oak Avenue, San Francisco, CA 94102A",
  location: "Florida, USA",
  postalCode: "30301",
};

export default function PersonalInformationForm() {
  const [values, setValues] = useState<PersonalInfoValues>(DEFAULT_VALUES);

  const session = useSession();
  const token = (session?.data?.user as { accessToken?: string })?.accessToken;

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (payload: Partial<PersonalInfoValues>) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) { toast.error(data?.message || "Something went wrong"); return; }
      toast.success(data?.message || "Profile updated successfully");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const set = (key: keyof PersonalInfoValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(values);
  };

  const inputCls = "h-[48px] rounded-[8px] border border-[#E0E4EC] bg-[#EDF2F6] px-4 text-sm text-[#343A40] placeholder:text-[#9CA3AF] focus-visible:ring-1 focus-visible:ring-primary";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[8px] shadow-[0px_4px_6px_0px_#0000001A] p-6 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#343A40]">Personal Information</h2>
        <p className="text-sm text-[#6B7280] mt-1">Manage your personal information and profile details.</p>
      </div>

      {/* Gender */}
      <div className="flex items-center gap-6">
        {(["male", "female"] as const).map((g) => (
          <label key={g} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#343A40] capitalize">
            <input
              type="radio"
              name="gender"
              value={g}
              checked={values.gender === g}
              onChange={() => setValues((v) => ({ ...v, gender: g }))}
              className="h-4 w-4 accent-primary"
            />
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </label>
        ))}
      </div>

      {/* First Name + Last Name */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#343A40]">First Name</label>
          <Input value={values.firstName} onChange={set("firstName")} className={inputCls} placeholder="First name" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#343A40]">Last Name</label>
          <Input value={values.lastName} onChange={set("lastName")} className={inputCls} placeholder="Last name" />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#343A40]">Email Address</label>
          <Input type="email" value={values.email} onChange={set("email")} className={inputCls} placeholder="Email address" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#343A40]">Phone Number</label>
          <Input value={values.phone} onChange={set("phone")} className={inputCls} placeholder="Phone number" />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#343A40]">Bio</label>
        <textarea
          value={values.bio}
          onChange={set("bio")}
          rows={3}
          placeholder="Write something about yourself..."
          className="w-full resize-none rounded-[8px] border border-[#E0E4EC] bg-[#EDF2F6] px-4 py-3 text-sm text-[#343A40] placeholder:text-[#9CA3AF] outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Street Address */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#343A40]">Street Address</label>
        <Input value={values.streetAddress} onChange={set("streetAddress")} className={inputCls} placeholder="Street address" />
      </div>

      {/* Location + Postal Code */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#343A40]">Location</label>
          <Input value={values.location} onChange={set("location")} className={inputCls} placeholder="City, Country" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#343A40]">Postal Code</label>
          <Input value={values.postalCode} onChange={set("postalCode")} className={inputCls} placeholder="Postal code" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setValues(DEFAULT_VALUES)}
          className="h-[44px] rounded-[8px] border border-[#F2415A] px-6 text-sm font-semibold text-[#F2415A] hover:bg-[#FFF5F5]"
        >
          Discard Changes
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="h-[44px] rounded-[8px] bg-gradient-to-b from-[#B1B2F4] to-[#6466E9] px-8 text-sm font-bold text-white hover:opacity-90"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
