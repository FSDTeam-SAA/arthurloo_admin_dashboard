"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartData {
  month: string;
  totalRevenue: number;
}

interface ChartApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    year: number;
    summary: {
      totalRevenue: number;
    };
    chartData: ChartData[];
  };
}

export function TotalEarningChart() {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const { data, isLoading, isError, error } = useQuery<ChartApiResponse>({
    queryKey: ["total-earning-chart", selectedYear],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/chart?year=${selectedYear}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch chart data");
      }

      return res.json();
    },
    enabled: !!token,
  });

  const chartData = data?.data?.chartData || [];

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: ChartData;
    }>;
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-md">
        <p className="text-[12px] font-medium text-[#6B7280]">
          {label} {selectedYear}
        </p>
        <p className="text-sm font-semibold text-[#1D4ED8]">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  };

  if (isError) {
    return (
      <div className="px-6 pb-6 pt-4">
        <ErrorContainer
          message={(error as Error)?.message || "Something went wrong"}
        />
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <CardTitle className="text-base md:text-lg font-semibold leading-normal text-[#343A40]">
              Total Earning
            </CardTitle>
            <p className="text-sm md:text-base font-semibold leading-normal text-[#343A40]">
              Track total revenue, platform commission, and payouts over time.
            </p>
          </div>
          
          <div className="flex items-center">
            <Select
              value={selectedYear.toString()}
              onValueChange={(val) => setSelectedYear(parseInt(val))}
            >
              <SelectTrigger className="w-[100px] h-9 rounded-xl border-[#E5E7EB] bg-white text-sm font-medium text-[#111827] focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()} className="text-sm cursor-pointer hover:bg-[#F3F4F6]">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="h-[320px] w-full relative">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center p-4">
                 <Skeleton className="h-full w-full rounded-2xl" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="earningFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.20} />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} stroke="#F1F5F9" />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(val) => `$${val}`}
                  />

                  <Tooltip
                    cursor={{
                      stroke: "#94A3B8",
                      strokeDasharray: "4 4",
                    }}
                    content={<CustomTooltip />}
                  />

                  <Area
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#1E3A8A"
                    strokeWidth={3}
                    fill="url(#earningFill)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#1E3A8A",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
