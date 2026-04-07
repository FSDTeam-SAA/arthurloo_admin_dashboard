"use client";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import { useSession } from "next-auth/react";
import DashboardOverviewSkeleton from "../../_components/dashboard-overview-skeleton";
import { DashboardOverviewsApiResponse } from "../../_components/dashboard-overview-data-type";



export function ManageUsersOverview() {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError, error } =
    useQuery<DashboardOverviewsApiResponse>({
      queryKey: ["dashboard-overview"],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/overview`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return await res.json();
      },
      enabled: !!token,
    });


  let content;

  if (isLoading) {
    content = (
      <div className="p-6">
        <DashboardOverviewSkeleton />
      </div>
    );
  } else if (isError) {
    content = (
      <div className="p-6">
        <ErrorContainer message={error?.message || "Something went wrong"} />
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div className="md:col-span-1 h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#616161] leading-normal">
              Total Users
            </p>
            <p className="text-3xl leading-[120%] text-primary font-bold font-hexco pt-2">
              {data?.data?.totalUser|| 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#F7F7FE] p-3 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div>

        <div className="md:col-span-1 h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#616161] leading-normal">
              Active Users
            </p>
            <p className="text-3xl leading-[120%] text-[#3FA96B] font-bold font-hexco pt-2">
              {data?.data?.activeUser || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#EAF9F1] p-3 rounded-full">
              <Users className="w-6 h-6 text-[#3FA96B]" />
            </span>
          </div>
        </div>

        <div className="md:col-span-1 h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#616161] leading-normal">
              Suspended Users
            </p>
            <p className="text-3xl leading-[120%] text-[#F2415A] font-bold font-hexco pt-2">
              {data?.data?.suspended || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#FCEEEC] p-3 rounded-full">
              <Users className="w-6 h-6 text-[#E5533D]" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <div className="">{content}</div>;
}
