"use client";

import React from "react";
import { CircleCheckBig } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubscribePlan } from "./manage-plan-data-type";

interface ManagePlanViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planData: SubscribePlan | null;
}

const ManagePlanView = ({ open, onOpenChange, planData }: ManagePlanViewProps) => {
  if (!planData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] overflow-hidden border-0 bg-white p-0 shadow-[0_24px_80px_rgba(15,23,42,0.18)] !rounded-[20px]">
        {/* Header with gradient */}
        <div className="relative px-6 pb-5 pt-6 sm:px-7">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-lg font-medium text-[#6B7280]">
              {planData.planName}
            </DialogTitle>
            <DialogDescription className="sr-only">
              View details of {planData.planName} plan
            </DialogDescription>
          </DialogHeader>

          {/* Price - large and bold like the reference image */}
          <div className="mt-2">
            <span className="text-4xl font-bold text-[#1B2559]">
              £{planData.price?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Features list with green checkmarks */}
        <div className="px-6 pb-6 pt-2 sm:px-7">
          <ul className="space-y-3.5">
            {planData.features?.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <CircleCheckBig className="h-5 w-5 shrink-0 text-[#16A34A]" />
                <span className="text-[15px] font-medium text-[#374151]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {(!planData.features || planData.features.length === 0) && (
            <p className="text-center text-sm text-[#9CA3AF] py-4">
              No features listed for this plan.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagePlanView;