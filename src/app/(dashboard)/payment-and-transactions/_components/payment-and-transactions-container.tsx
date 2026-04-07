"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import MireyagsPagination from "@/components/ui/mireyags-pagination";
import { useDebounce } from "@/hooks/useDebounce";

import { Button } from "@/components/ui/button";
import { Payment, PaymentApiResponse } from "./payment-data-type";
import moment from "moment";
import PaymentView from "./payment-view";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PaymentStatusFilter = "all" | "pending" | "completed" | "failed";

export default function PaymentAndTransactionsContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all");

  const [selectViewPayment, setSelectViewPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  const { data, isLoading, isError } = useQuery<PaymentApiResponse>({
    queryKey: ["all-payments", debouncedSearch, currentPage, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        searchTerm: debouncedSearch,
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch Payments");
      }

      return res.json();
    },
    enabled: !!token,
  });

  const payments = data?.data ?? [];
  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;
  const statusFilterLabel =
    statusFilter === "all"
      ? "Short By"
      : statusFilter === "completed"
        ? "Completed"
        : statusFilter === "pending"
          ? "Pending"
          : "Failed";

  return (
    <div className="px-2 py-4 sm:px-4 md:px-6">
      <div className="rounded-2xl border border-[#E4EAF3] bg-white p-3 shadow-sm sm:p-4 md:p-5">
        {/* top bar */}
        <div className="mb-4 flex flex-col gap-3 md:mb-5 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-[700px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <Input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search"
              className="h-11 rounded-xl border-[#C9D4E5] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#6B7280] focus-visible:ring-1 focus-visible:ring-[#2747A1]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                className="h-11 rounded-xl bg-[#2747A1] px-4 text-sm font-medium text-white hover:bg-[#1f3b8f]"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {statusFilterLabel}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[124px] rounded-xl border border-[#D7DDE8] bg-white p-1.5 shadow-[0px_8px_24px_rgba(17,24,39,0.12)]"
            >
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className={`rounded-[12px] px-3 py-2 text-base font-medium cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-[#2747A1] text-white focus:bg-[#2747A1] focus:text-white"
                    : "text-[#4B5563] focus:bg-[#F3F4F6] focus:text-[#111827]"
                }`}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("completed");
                  setCurrentPage(1);
                }}
                className={`rounded-[12px] px-3 py-2 text-base font-medium cursor-pointer ${
                  statusFilter === "completed"
                    ? "bg-[#2747A1] text-white focus:bg-[#2747A1] focus:text-white"
                    : "text-[#4B5563] focus:bg-[#F3F4F6] focus:text-[#111827]"
                }`}
              >
                Completed
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("pending");
                  setCurrentPage(1);
                }}
                className={`rounded-[12px] px-3 py-2 text-base font-medium cursor-pointer ${
                  statusFilter === "pending"
                    ? "bg-[#2747A1] text-white focus:bg-[#2747A1] focus:text-white"
                    : "text-[#4B5563] focus:bg-[#F3F4F6] focus:text-[#111827]"
                }`}
              >
                Pending
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("failed");
                  setCurrentPage(1);
                }}
                className={`rounded-[12px] px-3 py-2 text-base font-medium cursor-pointer ${
                  statusFilter === "failed"
                    ? "bg-[#2747A1] text-white focus:bg-[#2747A1] focus:text-white"
                    : "text-[#4B5563] focus:bg-[#F3F4F6] focus:text-[#111827]"
                }`}
              >
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* table */}
        <div className="overflow-x-auto rounded-xl border border-white">
          <table className="min-w-full">
            <thead className="bg-[#9DC2FF33]">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 text-left text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  User Name
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  Email
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  Joining Date
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  Plan Name
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  Price
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-left text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  Status
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-center text-lg md:text-xl leading-normal font-semibold text-[#343A40]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-[#9DC2FF33]">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-t border-white">
                    <td className="px-6 py-4">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    </td>
                     <td className="px-6 py-4">
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    </td>
                     <td className="px-6 py-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-red-500"
                  >
                    Failed to load Payments.
                  </td>
                </tr>
              ) : payments?.length ? (
                payments?.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-t-[1.5px] border-white transition-colors hover:bg-[#F1F6FD]"
                  >
                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      {payment?.user?.fullName || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      {payment?.user?.email || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      {moment(payment.createdAt).format("DD MMM YYYY")}
                    </td>
                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      {payment?.subscribe?.planName || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      {payment?.amount ? `$${payment.amount}` : "N/A"}
                    </td>

                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      <button
                        className={`w-[100px] px-3 py-1 rounded-full text-base font-normal leading-normal ${
                          payment?.status === "completed"
                            ? "bg-[#34C75933]/20 text-[#34C759]"
                            : payment?.status === "pending"
                              ? "bg-[#FEF8E6] text-[#FFBF0F]"
                              : "bg-[#FF0F3C33]/20 text-[#FF0F3C]"
                        }`}
                      >
                        {payment?.status}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          className="text-[#111827] transition hover:scale-105 hover:text-[#2747A1]"
                          onClick={() => {
                            setSelectViewPayment(true);
                            setSelectedPayment(payment);
                          }}
                        >
                          <Eye className="h-6 w-6 text-black" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-[#6B7280]"
                  >
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}

        {totalPages > 1 && (
          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-primary leading-normal font-normal">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, totalPages * 10)} of {totalPages * 10}{" "}
              results
            </p>

            <div>
              <MireyagsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}

        {/* view modal */}
        {selectViewPayment && (
          <PaymentView
            open={selectViewPayment}
            onOpenChange={(open: boolean) => setSelectViewPayment(open)}
            paymentData={selectedPayment}
          />
        )}
      </div>
    </div>
  );
}
