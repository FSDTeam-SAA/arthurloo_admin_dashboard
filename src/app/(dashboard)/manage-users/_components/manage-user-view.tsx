import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import moment from "moment";
import { ManageUser } from "./manage-users-data-type";

const ManageUserView = ({
  open,
  onOpenChange,
  manageUser,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manageUser: ManageUser | null;
}) => {
  const [status, setStatus] = useState<ManageUser["status"]>("active");
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  useEffect(() => {
    if (manageUser?.status) {
      setStatus(manageUser.status);
    }
  }, [manageUser]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-user-status-from-modal"],
    mutationFn: async ({
      id,
      nextStatus,
    }: {
      id: string;
      nextStatus: ManageUser["status"];
    }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      return res.json();
    },
    onSuccess: (response, variables) => {
      if (!response?.success) {
        toast.error(response?.message || "Failed to update user status");
        return;
      }

      setStatus(variables.nextStatus);
      toast.success(response?.message || "User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  if (!manageUser) return null;

  const handleStatusUpdate = () => {
    const nextStatus: ManageUser["status"] =
      status === "active" ? "suspended" : "active";

    mutate({
      id: manageUser._id,
      nextStatus,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 bg-white !rounded-[12px]">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-semibold text-primary leading-normal">
            Users Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {/* Name */}
          <div>
            <p className="text-base md:text-lg leading-normal font-semibold text-[#343A40]">
              User Name :
            </p>
            <p className="text-lg md:text-xl font-bold text-[#111111] leading-normal">
              {manageUser.fullName}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-base md:text-lg leading-normal font-semibold text-[#343A40]">
              Email :
            </p>
            <p className="text-lg md:text-xl font-bold text-[#111111] leading-normal">
              {manageUser.email}
            </p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-base md:text-lg leading-normal font-semibold text-[#343A40]">
              Phone Number :
            </p>
            <p className="text-lg md:text-xl font-bold text-[#111111] leading-normal">
              {manageUser.phoneNumber}
            </p>
          </div>

          {/* Date */}
          <div>
            <p className="text-base md:text-lg leading-normal font-semibold text-[#343A40]">
              Joining Date :
            </p>
            <p className="text-lg md:text-xl font-bold text-[#111111] leading-normal">
              {moment(manageUser.createdAt).format("MMM DD, YYYY")}
            </p>
          </div>

          {/* status */}
          <div>
            <p className="text-base md:text-lg leading-normal font-semibold text-[#343A40] pb-2">
              Status :
            </p>
            <p className="text-lg md:text-xl font-bold text-[#111111] leading-normal">
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={isPending}
                className={`inline-flex min-w-[126px] items-center justify-center rounded-full px-6 py-1 text-base font-medium leading-normal transition ${
                  status === "active"
                    ? "bg-[#BFE8DA] text-[#22C55E] hover:bg-[#b0e1d1]"
                    : "bg-[#E8B7D3] text-[#FF2442] hover:bg-[#e1a4c7]"
                } ${isPending ? "cursor-not-allowed opacity-70" : ""}`}
              >
                {isPending
                  ? "Updating..."
                  : status === "active"
                    ? "Active"
                    : "Suspended"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageUserView;
