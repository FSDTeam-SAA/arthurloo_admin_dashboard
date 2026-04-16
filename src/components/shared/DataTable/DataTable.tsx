import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const TABLE_BG = "rgba(172, 58, 212, 0.05)";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  skeletonWidth?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  isError = false,
  skeletonRows = 10,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  const alignClass = (align?: "left" | "center" | "right") => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow
          style={{ backgroundColor: TABLE_BG }}
          className="border-0 hover:brightness-100"
        >
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={`whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#343A40] ${alignClass(col.align)}`}
            >
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          Array.from({ length: skeletonRows }).map((_, i) => (
            <TableRow
              key={i}
              style={{ backgroundColor: TABLE_BG }}
              className="border-t border-white hover:brightness-100"
            >
              {columns.map((col) => (
                <TableCell key={col.key} className="px-6 py-4">
                  <Skeleton
                    className="h-4 rounded"
                    style={{ width: col.skeletonWidth ?? "80%" }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : isError ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="py-12 text-center text-sm text-red-500"
            >
              Something went wrong. Please try again.
            </TableCell>
          </TableRow>
        ) : data.length ? (
          data.map((row, i) => (
            <TableRow
              key={i}
              style={{ backgroundColor: TABLE_BG }}
              className="border-t border-white transition-colors hover:brightness-95"
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={`px-6 py-4 text-sm font-medium text-[#343A40] ${alignClass(col.align)}`}
                >
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="py-12 text-center text-sm text-[#6B7280]"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
