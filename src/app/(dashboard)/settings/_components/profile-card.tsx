"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import userPlaceholder from "../../../../../public/assets/images/no-user.jpeg";

interface ProfileCardProps {
  name?: string;
  email?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export default function ProfileCard({ name, email, bio, phone, location }: ProfileCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  return (
    <div className="w-full rounded-[8px] bg-white shadow-[0px_4px_6px_0px_#0000001A] overflow-hidden">
      {/* Banner */}
      <div className="h-[110px] w-full bg-gradient-to-r from-[#6466E9] to-[#AC3AD4]" />

      {/* Avatar */}
      <div className="flex flex-col items-center -mt-12 px-4 pb-5">
        <div className="relative">
          <div className="h-[90px] w-[90px] rounded-full border-4 border-white overflow-hidden">
            <Image
              src={avatar || userPlaceholder}
              alt={name || "Admin"}
              width={90}
              height={90}
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        <h3 className="mt-3 text-base font-bold text-primary leading-tight">{name || "N/A"}</h3>
        <p className="text-xs text-[#6B7280]">{email || "N/A"}</p>
      </div>

      {/* Info */}
      <div className="border-t border-[#F3F4F6] px-5 py-4 space-y-3">
        <InfoRow label="Name" value={name || "N/A"} />
        <InfoRow label="Bio" value={bio || "N/A"} multiline />
        <InfoRow label="Email" value={email || "N/A"} />
        <InfoRow label="Phone" value={phone || "N/A"} />
        <InfoRow label="Location" value={location || "N/A"} />
      </div>
    </div>
  );
}

function InfoRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-sm text-[#343A40]">
        <span className="font-bold">{label}:</span>{" "}
        <span className={`font-normal text-[#4B5563] ${multiline ? "block mt-0.5" : "inline"}`}>{value}</span>
      </p>
    </div>
  );
}
