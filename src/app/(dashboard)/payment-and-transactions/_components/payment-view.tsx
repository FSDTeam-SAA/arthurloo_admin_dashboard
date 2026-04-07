import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Payment } from "./payment-data-type";
import moment from "moment";

interface PaymentViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentData: Payment | null;
}

const PaymentView = ({ open, onOpenChange, paymentData }: PaymentViewProps) => {
  if (!paymentData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 sm:rounded-2xl bg-white border-0 shadow-xl outline-none overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-[#E4EAF3]">
          <DialogTitle className="text-xl font-bold text-[#111827] md:text-2xl">
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-6">
          {/* Amount and Status */}
          <div className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-5 border border-[#E4EAF3]">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#6B7280]">Amount</span>
              <span className="text-3xl font-bold text-[#111827]">
                ${paymentData.amount?.toFixed(2) || "0.00"}
              </span>
            </div>
            {/* Status Badge */}
            <div
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
                paymentData.status === "completed"
                  ? "bg-[#34C75933]/20 text-[#34C759]"
                  : paymentData.status === "pending"
                    ? "bg-[#FEF8E6] text-[#FFBF0F]"
                    : "bg-[#FF0F3C33]/20 text-[#FF0F3C]"
              }`}
            >
              {paymentData.status}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-[#111827]">
              Transaction Info
            </h3>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Date</span>
              <span className="font-medium text-[#111827]">
                {moment(paymentData.createdAt).format("DD MMM YYYY, hh:mm A")}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Payment Type</span>
              <span className="font-medium text-[#111827] uppercase">
                {paymentData.paymentType || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Transaction ID</span>
              <span className="font-medium text-[#111827] truncate max-w-[180px] sm:max-w-[220px]" title={paymentData.stripePaymentIntentId}>
                {paymentData.stripePaymentIntentId || "N/A"}
              </span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#E4EAF3]" />

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-[#111827]">
              Customer & Plan
            </h3>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Name</span>
              <span className="font-medium text-[#111827]">
                {paymentData.user?.fullName || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Email</span>
              <span className="font-medium text-[#111827]">
                {paymentData.user?.email || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Plan</span>
              <span className="font-medium text-[#111827]">
                {paymentData.subscribe?.planName || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentView;