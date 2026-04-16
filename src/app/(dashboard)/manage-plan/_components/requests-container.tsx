"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MireyagsPagination from "@/components/ui/mireyags-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, DataTableColumn } from "@/components/shared/DataTable/DataTable";
import { RequestStatus, UserRequest } from "./requests-data-type";

const INPUT_BG = "rgba(172, 58, 212, 0.05)";

const MOCK_REQUESTS: UserRequest[] = [
  { _id: "1", fullName: "Bessie Cooper", userRole: "Teacher", status: "approved", createdAt: "", updatedAt: "" },
  { _id: "2", fullName: "Dianne Russell", userRole: "Teacher", status: "suspended", createdAt: "", updatedAt: "" },
  { _id: "3", fullName: "Leslie Alexander", userRole: "Parents", status: "approved", createdAt: "", updatedAt: "" },
  { _id: "4", fullName: "Courtney Henry", userRole: "Teacher", status: "approved", createdAt: "", updatedAt: "" },
  { _id: "5", fullName: "Jerome Bell", userRole: "Parents", status: "approved", createdAt: "", updatedAt: "" },
  { _id: "6", fullName: "Jenny Wilson", userRole: "Teacher", status: "suspended", createdAt: "", updatedAt: "" },
  { _id: "7", fullName: "Jenny Wilson", userRole: "Teacher", status: "pending", createdAt: "", updatedAt: "" },
  { _id: "8", fullName: "Ronald Richards", userRole: "Parents", status: "pending", createdAt: "", updatedAt: "" },
  { _id: "9", fullName: "Albert Flores", userRole: "Teacher", status: "suspended", createdAt: "", updatedAt: "" },
  { _id: "10", fullName: "Robert Fox", userRole: "Teacher", status: "approved", createdAt: "", updatedAt: "" },
];

const ITEMS_PER_PAGE = 10;

const statusStyles: Record<RequestStatus, string> = {
  approved: "text-[#34C759]",
  pending: "text-[#F59E0B]",
  suspended: "text-[#FF3B30]",
};

type StatusFilter = "all" | RequestStatus;

export default function RequestsContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [requests, setRequests] = useState<UserRequest[]>(MOCK_REQUESTS);

  const filtered = requests.filter((r) => {
    const matchSearch = r.fullName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusUpdate = (id: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status } : r))
    );
  };

  const statusFilterLabel =
    statusFilter === "all" ? "Short By" :
    statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);

  const columns: DataTableColumn<UserRequest>[] = [
    {
      key: "name",
      label: "User Name",
      skeletonWidth: "140px",
      render: (req) => req.fullName,
    },
    {
      key: "role",
      label: "User Role",
      skeletonWidth: "80px",
      render: (req) => req.userRole,
    },
    {
      key: "status",
      label: "Status",
      skeletonWidth: "80px",
      render: (req) => (
        <span className={`text-sm font-medium capitalize ${statusStyles[req.status]}`}>
          {req.status}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      align: "center",
      skeletonWidth: "80px",
      render: (req) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-[32px] items-center gap-1 rounded-[6px] border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#374151] shadow-sm transition hover:bg-[#F9FAFB]"
              >
                Action
                <ChevronDown className="h-3.5 w-3.5 text-[#6B7280]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[130px] rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-md">
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(req._id, "suspended")}
                className="cursor-pointer rounded-[6px] px-3 py-2 text-sm font-medium text-[#FF3B30] focus:bg-[#FFF1F0] focus:text-[#FF3B30]"
              >
                Deny
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(req._id, "approved")}
                className="cursor-pointer rounded-[6px] px-3 py-2 text-sm font-medium text-[#34C759] focus:bg-[#F0FFF4] focus:text-[#34C759]"
              >
                Approved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="rounded-[8px] bg-white shadow-[0px_4px_6px_0px_#0000001A]">

        {/* top bar */}
        <div className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <Input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name"
              style={{ backgroundColor: INPUT_BG }}
              className="h-[44px] rounded-[8px] border border-[#AC3AD4] pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus-visible:ring-1 focus-visible:ring-[#AC3AD4]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-[40px] rounded-[8px] bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {statusFilterLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px] rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-md">
              {(["all", "approved", "pending", "suspended"] as StatusFilter[]).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                  className={`cursor-pointer rounded-[6px] px-3 py-2 text-sm font-medium capitalize ${
                    statusFilter === s
                      ? "bg-primary text-white focus:bg-primary focus:text-white"
                      : "text-[#374151] focus:bg-[#F3F4F6]"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* table */}
        <DataTable
          columns={columns}
          data={paginated}
          emptyMessage="No requests found."
        />

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-sm font-normal text-primary">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} results
            </p>
            <MireyagsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
