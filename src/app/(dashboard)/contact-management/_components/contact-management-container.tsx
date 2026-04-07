"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Eye, Search } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import MireyagsPagination from "@/components/ui/mireyags-pagination";
import DeleteModal from "@/components/modals/delete-modal";
import { useDebounce } from "@/hooks/useDebounce";
import { Contact, ContactsApiResponse } from "./contact-data-type";
import ContactManagementView from "./contact-management-view";

export default function ContactUsContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectViewContact, setSelectViewContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  const { data, isLoading, isError } = useQuery<ContactsApiResponse>({
    queryKey: ["contacts", debouncedSearch, currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact?page=${currentPage}&limit=4&searchTerm=${debouncedSearch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch contacts");
      }

      return res.json();
    },
    enabled: !!token,
  });

  const contacts = data?.data ?? [];
  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;

  const { mutate } = useMutation({
    mutationKey: ["delete-contact"],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact/${id}`,
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

      toast.success(response?.message || "Contact deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: () => {
      toast.error("Failed to delete contact");
    },
  });

  const handleDelete = () => {
    if (selectedId) {
      mutate(selectedId);
    }
    setDeleteModalOpen(false);
  };

  return (
    <div className="p-6">
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
                  Phone Number
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
                    Failed to load contacts.
                  </td>
                </tr>
              ) : contacts.length ? (
                contacts.map((contact) => (
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
                      {contact.phoneNumber || "N/A"}
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
                    colSpan={4}
                    className="py-12 text-center text-sm text-[#6B7280]"
                  >
                    No contacts found.
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
            desc="Are you sure you want to delete this Contact?"
          />
        )}

        {/* view modal */}
        {selectViewContact && (
          <ContactManagementView
            open={selectViewContact}
            onOpenChange={(open: boolean) => setSelectViewContact(open)}
            contactData={selectedContact}
          />
        )}
      </div>
    </div>
  );
}
