"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Eye, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import MireyagsPagination from "@/components/ui/mireyags-pagination";
import DeleteModal from "@/components/modals/delete-modal";
import { useDebounce } from "@/hooks/useDebounce";

import { Button } from "@/components/ui/button";
import { ManageUser, ManageUserApiResponse } from "./manage-users-data-type";
import ManageUserView from "./manage-user-view";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserStatusFilter = "all" | "active" | "suspended";

export default function ManageUserscontainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("all");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const [selectViewContact, setSelectViewContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ManageUser | null>(
    null,
  );

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

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      return res.json();
    },
    enabled: !!token,
  });

  const users = data?.data ?? [];
  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;
  const statusFilterLabel =
    statusFilter === "all"
      ? "Short By"
      : statusFilter === "active"
        ? "Active"
        : "Suspended";

  const { mutate } = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.json();
    },
    onSuccess: (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Something went wrong");
        return;
      }

      toast.success(response?.message || "user deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const { mutate: mutateUserStatus } = useMutation({
    mutationKey: ["update-user-status"],
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ManageUser["status"];
    }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      return res.json();
    },
    onMutate: ({ id }) => {
      setUpdatingStatusId(id);
    },
    onSuccess: (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Failed to update user status");
        return;
      }

      toast.success(response?.message || "User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
    onSettled: () => {
      setUpdatingStatusId(null);
    },
  });

  const handleDelete = () => {
    if (selectedId) {
      mutate(selectedId);
    }
    setDeleteModalOpen(false);
  };

  const handleStatusUpdate = (contact: ManageUser) => {
    const nextStatus: ManageUser["status"] =
      contact.status === "active" ? "suspended" : "active";

    mutateUserStatus({
      id: contact._id,
      status: nextStatus,
    });
  };

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
              className="w-[120px] rounded-xl border border-[#D7DDE8] bg-white p-1.5 shadow-[0px_8px_24px_rgba(17,24,39,0.12)]"
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
                  setStatusFilter("active");
                  setCurrentPage(1);
                }}
                className={`rounded-[12px] px-3 py-2 text-base font-medium cursor-pointer ${
                  statusFilter === "active"
                    ? "bg-[#2747A1] text-white focus:bg-[#2747A1] focus:text-white"
                    : "text-[#4B5563] focus:bg-[#F3F4F6] focus:text-[#111827]"
                }`}
              >
                Active
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("suspended");
                  setCurrentPage(1);
                }}
                className={`rounded-[12px] px-3 py-2 text-base font-medium cursor-pointer ${
                  statusFilter === "suspended"
                    ? "bg-[#2747A1] text-white focus:bg-[#2747A1] focus:text-white"
                    : "text-[#4B5563] focus:bg-[#F3F4F6] focus:text-[#111827]"
                }`}
              >
                Suspended
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
                  Phone Number
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
                    colSpan={4}
                    className="py-12 text-center text-sm text-red-500"
                  >
                    Failed to load users.
                  </td>
                </tr>
              ) : users.length ? (
                users.map((contact) => (
                  <tr
                    key={contact._id}
                    className="border-t-[1.5px] border-white transition-colors hover:bg-[#F1F6FD]"
                  >
                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      {contact.fullName || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      <span className="block max-w-[260px] truncate">
                        {contact.email || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      <span className="block max-w-[260px] truncate">
                       {moment(contact.createdAt).format("DD MMM YYYY")}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      {contact.phoneNumber || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-base font-medium text-[#343A40] leading-normal">
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(contact)}
                        disabled={updatingStatusId === contact._id}
                        className={`inline-flex min-w-[126px] items-center justify-center rounded-full px-6 py-1 text-base font-medium leading-normal transition ${
                          contact?.status === "active"
                            ? "bg-[#34C75933]/20 text-[#34C759] hover:bg-[#b0e1d1]"
                            : "bg-[#FF0F3C33]/20 text-[#FF0F3C] hover:bg-[#e1a4c7]"
                        } ${updatingStatusId === contact._id ? "cursor-not-allowed opacity-70" : ""}`}
                      >
                        {updatingStatusId === contact._id
                          ? "Updating..."
                          : contact.status === "active"
                            ? "Active"
                            : "Suspended"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          className="text-[#111827] transition hover:scale-105 hover:text-[#2747A1]"
                          onClick={() => {
                            setSelectViewContact(true);
                            setSelectedContact(contact);
                          }}
                        >
                          <Eye className="h-6 w-6 text-black" />
                        </button>

                        <button
                          type="button"
                          className="text-[#111827] transition hover:scale-105 hover:text-red-600"
                          onClick={() => {
                            setDeleteModalOpen(true);
                            setSelectedId(contact._id);
                          }}
                        >
                          <Trash2 className="h-6 w-6 text-black" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-[#6B7280]"
                  >
                    No users found.
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

        {/* delete modal */}
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Are You Sure?"
            desc="Are you sure you want to delete this User?"
          />
        )}

        {/* view modal */}
        {selectViewContact && (
          <ManageUserView
            open={selectViewContact}
            onOpenChange={(open: boolean) => setSelectViewContact(open)}
            manageUser={selectedContact}
          />
        )}
      </div>
    </div>
  );
}
