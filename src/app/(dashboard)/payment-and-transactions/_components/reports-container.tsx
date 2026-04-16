"use client";

import { useState } from "react";
import { Eye, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";

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
import DeleteModal from "@/components/modals/delete-modal";
import ReportViewModal from "./report-view-modal";
import userPlaceholder from "../../../../../public/assets/images/no-user.jpeg";

const INPUT_BG = "rgba(172, 58, 212, 0.05)";
const ITEMS_PER_PAGE = 10;

type ReportType = "IDP" | "IFP";

interface Report {
  id: string;
  reportId: string;
  generatedBy: string;
  avatar: string;
  type: ReportType;
  created: string;
  phoneNumber: string;
  status: string;
  individual: string;
  role: string;
  lastUpdated: string;
}

const MOCK_REPORTS: Report[] = [
  { id: "1",  reportId: "RPT-1023", generatedBy: "Colleen",   avatar: "", type: "IDP", created: "12 Feb 2026", phoneNumber: "+2198412365", status: "Active", individual: "Williams",  role: "Teacher", lastUpdated: "12/03/2026" },
  { id: "2",  reportId: "RPT-1023", generatedBy: "Gloria",    avatar: "", type: "IFP", created: "12 Feb 2026", phoneNumber: "+2198412366", status: "Active", individual: "Johnson",   role: "Parents", lastUpdated: "12/03/2026" },
  { id: "3",  reportId: "RPT-1023", generatedBy: "Bessie",    avatar: "", type: "IDP", created: "12 Feb 2026", phoneNumber: "+2198412367", status: "Active", individual: "Cooper",    role: "Teacher", lastUpdated: "12/03/2026" },
  { id: "4",  reportId: "RPT-1023", generatedBy: "Regina",    avatar: "", type: "IFP", created: "12 Feb 2026", phoneNumber: "+2198412368", status: "Active", individual: "Russell",   role: "Parents", lastUpdated: "12/03/2026" },
  { id: "5",  reportId: "RPT-1023", generatedBy: "Wendy",     avatar: "", type: "IDP", created: "12 Feb 2026", phoneNumber: "+2198412369", status: "Active", individual: "Alexander", role: "Teacher", lastUpdated: "12/03/2026" },
  { id: "6",  reportId: "RPT-1023", generatedBy: "Priscilla", avatar: "", type: "IFP", created: "12 Feb 2026", phoneNumber: "+2198412370", status: "Active", individual: "Henry",     role: "Teacher", lastUpdated: "12/03/2026" },
  { id: "7",  reportId: "RPT-1023", generatedBy: "Judith",    avatar: "", type: "IDP", created: "12 Feb 2026", phoneNumber: "+2198412371", status: "Active", individual: "Bell",      role: "Teacher", lastUpdated: "12/03/2026" },
  { id: "8",  reportId: "RPT-1023", generatedBy: "Serenity",  avatar: "", type: "IFP", created: "12 Feb 2026", phoneNumber: "+2198412372", status: "Active", individual: "Wilson",    role: "Parents", lastUpdated: "12/03/2026" },
  { id: "9",  reportId: "RPT-1023", generatedBy: "Darlene",   avatar: "", type: "IDP", created: "12 Feb 2026", phoneNumber: "+2198412373", status: "Active", individual: "Richards",  role: "Teacher", lastUpdated: "12/03/2026" },
  { id: "10", reportId: "RPT-1023", generatedBy: "Gladys",    avatar: "", type: "IFP", created: "12 Feb 2026", phoneNumber: "+2198412374", status: "Active", individual: "Fox",       role: "Teacher", lastUpdated: "12/03/2026" },
  { id: "11", reportId: "RPT-1023", generatedBy: "Beverly",   avatar: "", type: "IDP", created: "12 Feb 2026", phoneNumber: "+2198412375", status: "Active", individual: "Beverly",   role: "Parents", lastUpdated: "12/03/2026" },
  { id: "12", reportId: "RPT-1023", generatedBy: "Amber",     avatar: "", type: "IFP", created: "12 Feb 2026", phoneNumber: "+2198412376", status: "Active", individual: "Amber",     role: "Teacher", lastUpdated: "12/03/2026" },
];

type TypeFilter = "all" | ReportType;

export default function ReportsContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.generatedBy.toLowerCase().includes(search.toLowerCase()) ||
      r.reportId.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = () => {
    if (deleteId) setReports((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
  };

  const typeFilterLabel = typeFilter === "all" ? "Short By" : typeFilter;

  const columns: DataTableColumn<Report>[] = [
    {
      key: "reportId",
      label: "Report ID",
      skeletonWidth: "90px",
      render: (r) => r.reportId,
    },
    {
      key: "generatedBy",
      label: "Generated by",
      skeletonWidth: "120px",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Image
            src={r.avatar || userPlaceholder}
            alt={r.generatedBy}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span>{r.generatedBy}</span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      skeletonWidth: "50px",
      render: (r) => r.type,
    },
    {
      key: "created",
      label: "Created",
      skeletonWidth: "100px",
      render: (r) => r.created,
    },
    {
      key: "actions",
      label: "Actions",
      align: "center",
      skeletonWidth: "60px",
      render: (r) => (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setViewReport(r)}
            className="text-[#6B7280] transition hover:text-[#343A40]"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(r.id)}
            className="text-[#6B7280] transition hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
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
                {typeFilterLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px] rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-md">
              {(["all", "IDP", "IFP"] as TypeFilter[]).map((t) => (
                <DropdownMenuItem
                  key={t}
                  onClick={() => { setTypeFilter(t); setCurrentPage(1); }}
                  className={`cursor-pointer rounded-[6px] px-3 py-2 text-sm font-medium ${
                    typeFilter === t
                      ? "bg-primary text-white focus:bg-primary focus:text-white"
                      : "text-[#374151] focus:bg-[#F3F4F6]"
                  }`}
                >
                  {t === "all" ? "All" : t}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* table */}
        <DataTable
          columns={columns}
          data={paginated}
          emptyMessage="No reports found."
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

      {/* view modal */}
      <ReportViewModal
        isOpen={!!viewReport}
        onClose={() => setViewReport(null)}
        report={
          viewReport
            ? {
                reportId:    viewReport.reportId,
                phoneNumber: viewReport.phoneNumber,
                status:      viewReport.status,
                individual:  viewReport.individual,
                generatedBy: viewReport.generatedBy,
                role:        viewReport.role,
                reportType:  viewReport.type,
                createdDate: viewReport.created,
                lastUpdated: viewReport.lastUpdated,
              }
            : null
        }
      />

      {/* delete modal */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete?"
        desc=""
      />
    </div>
  );
}
