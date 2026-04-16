"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Search, SlidersHorizontal, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MireyagsPagination from "@/components/ui/mireyags-pagination";
import DeleteModal from "@/components/modals/delete-modal";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, DataTableColumn } from "@/components/shared/DataTable/DataTable";
import { ManageUser, ManageUserApiResponse } from "./manage-users-data-type";
import ManageUserView from "./manage-user-view";
import userPlaceholder from "../../../../../public/assets/images/no-user.jpeg";

const INPUT_BG = "rgba(172, 58, 212, 0.05)";
type UserStatusFilter = "all" | "active" | "suspended";

export default function ManageUserscontainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("all");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [selectViewContact, setSelectViewContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ManageUser | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  const { data, isLoading, isError } = useQuery<ManageUserApiResponse>({
    queryKey: ["all-users", debouncedSearch, currentPage, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        searchTerm: debouncedSearch,
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: !!token,
  });

  const users = data?.data ?? [];
  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0;

  const { mutate: mutateDelete } = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    onSuccess: (response) => {
      if (!response?.success) { toast.error(response?.message || "Something went wrong"); return; }
      toast.success(response?.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const { mutate: mutateUserStatus } = useMutation({
    mutationKey: ["update-user-status"],
    mutationFn: async ({ id, status }: { id: string; status: ManageUser["status"] }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onMutate: ({ id }) => setUpdatingStatusId(id),
    onSuccess: (response) => {
      if (!response?.success) { toast.error(response?.message || "Failed to update status"); return; }
      toast.success(response?.message || "User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: () => toast.error("Failed to update user status"),
    onSettled: () => setUpdatingStatusId(null),
  });

  const handleDelete = () => {
    if (selectedId) mutateDelete(selectedId);
    setDeleteModalOpen(false);
  };

  const handleStatusToggle = (user: ManageUser) => {
    mutateUserStatus({
      id: user._id,
      status: user.status === "active" ? "suspended" : "active",
    });
  };

  const statusFilterLabel =
    statusFilter === "all" ? "Short By" :
    statusFilter === "active" ? "Active" : "Suspended";

  const columns: DataTableColumn<ManageUser>[] = [
    {
      key: "image",
      label: "User Image",
      skeletonWidth: "44px",
      render: (user) => (
        <Image
          src={user.profilePicture || userPlaceholder}
          alt={user.fullName}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />
      ),
    },
    {
      key: "name",
      label: "User Name",
      skeletonWidth: "120px",
      render: (user) => user.fullName || "N/A",
    },
    {
      key: "role",
      label: "User Role",
      skeletonWidth: "80px",
      render: (user) =>
        (user as ManageUser & { userRole?: string }).userRole || user.role || "N/A",
    },
    {
      key: "status",
      label: "Status",
      skeletonWidth: "80px",
      render: (user) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            user.status === "active"
              ? "bg-[#34C75933]/20 text-[#34C759]"
              : "bg-[#FF3B3033]/20 text-[#FF3B30]"
          }`}
        >
          {user.status === "active" ? "Active" : "Suspended"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      align: "center",
      skeletonWidth: "60px",
      render: (user) => (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => { setSelectViewContact(true); setSelectedContact(user); }}
            className="text-[#6B7280] transition hover:text-[#343A40]"
          >
            <Eye className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="text-[#6B7280] transition hover:text-[#343A40]">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-md">
              <DropdownMenuItem
                onClick={() => { setSelectViewContact(true); setSelectedContact(user); }}
                className="cursor-pointer rounded-[6px] px-3 py-2 text-sm text-[#374151] focus:bg-[#F3F4F6]"
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusToggle(user)}
                disabled={updatingStatusId === user._id}
                className="cursor-pointer rounded-[6px] px-3 py-2 text-sm text-[#374151] focus:bg-[#F3F4F6]"
              >
                {updatingStatusId === user._id
                  ? "Updating..."
                  : user.status === "active" ? "Suspend User" : "Activate User"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { setDeleteModalOpen(true); setSelectedId(user._id); }}
                className="cursor-pointer rounded-[6px] px-3 py-2 text-sm text-red-500 focus:bg-red-50 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
            <DropdownMenuContent align="end" className="w-[140px] rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-md">
              {(["all", "active", "suspended"] as UserStatusFilter[]).map((s) => (
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
          data={users}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No users found."
        />

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-sm font-normal text-primary">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, data?.meta?.total ?? 0)} of{" "}
              {data?.meta?.total ?? 0} results
            </p>
            <MireyagsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Are You Sure?"
          desc="Are you sure you want to delete this User?"
        />
      )}
      {selectViewContact && (
        <ManageUserView
          open={selectViewContact}
          onOpenChange={(open: boolean) => setSelectViewContact(open)}
          manageUser={selectedContact}
        />
      )}
    </div>
  );
}
