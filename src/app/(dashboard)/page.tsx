"use client";

import React from 'react'
import DashboardOverviewHeader from './_components/dashboard-overview-header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, XCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import userPlaceholder from "../../../public/assets/images/no-user.jpeg";

const chartData = [
  { month: "Jan", activity: 70 },
  { month: "Feb", activity: 100 },
  { month: "Mar", activity: 110 },
  { month: "Apr", activity: 80 },
  { month: "May", activity: 90 },
  { month: "June", activity: 150 },
  { month: "July", activity: 170 },
  { month: "Aug", activity: 150 },
  { month: "Sep", activity: 170 },
  { month: "Oct", activity: 180 },
  { month: "Nov", activity: 140 },
  { month: "Dec", activity: 120 },
];

const recentActivities = [
  { id: 1, name: "Sarah Johnson", action: "Create a new account as a Teacher", time: "2 min ago", avatar: userPlaceholder },
  { id: 2, name: "Michael Chen", action: "Create a new account as a Teacher", time: "2 min ago", avatar: userPlaceholder },
  { id: 3, name: "Emma Williams", action: "Create a new account as a Mother", time: "2 min ago", avatar: userPlaceholder },
];

const DashboardOverviewPage = () => {
  return (
    <div>
      <DashboardOverviewHeader title='Dashboard Overview' description="Welcome back! Here's what's happening with Naturopath.ai today." />

      <div className="p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
            <div>
              <p className="text-sm font-semibold text-[#616161] leading-normal">Total Users</p>
              <p className="text-3xl leading-[120%] text-[#9A55FF] font-bold pt-2">1,247</p>
            </div>
            <div>
              <span className="flex items-center justify-center bg-[#F7F7FE] p-3 rounded-full text-[#9A55FF]">
                <Users className="w-5 h-5" />
              </span>
            </div>
          </div>

          <div className="h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
            <div>
              <p className="text-sm font-semibold text-[#616161] leading-normal">Active Users</p>
              <p className="text-3xl leading-[120%] text-[#9A55FF] font-bold pt-2">1000</p>
            </div>
            <div>
              <span className="flex items-center justify-center bg-[#F7F7FE] p-3 rounded-full text-[#9A55FF]">
                <CheckCircle className="w-5 h-5" />
              </span>
            </div>
          </div>

          <div className="h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
            <div>
              <p className="text-sm font-semibold text-[#616161] leading-normal">Suspended Users</p>
              <p className="text-3xl leading-[120%] text-[#9A55FF] font-bold pt-2">247</p>
            </div>
            <div>
              <span className="flex items-center justify-center bg-[#F7F7FE] p-3 rounded-full text-[#9A55FF]">
                <XCircle className="w-5 h-5" />
              </span>
            </div>
          </div>

          <div className="h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
            <div>
              <p className="text-sm font-semibold text-[#616161] leading-normal">AI Chat Sessions</p>
              <p className="text-3xl leading-[120%] text-[#9A55FF] font-bold pt-2">10,000</p>
            </div>
            <div>
              <span className="flex items-center justify-center bg-[#F7F7FE] p-3 rounded-full text-[#9A55FF]">
                <Sparkles className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <Card className="rounded-[8px] border border-[#F3F4F6] shadow-[0px_4px_6px_0px_#0000001A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#343A40]">
              User Activity Over Time <span className="text-gray-400 font-normal">ⓘ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f5f5f5" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="activity" stroke="#A855F7" strokeWidth={2} fillOpacity={1} fill="url(#colorActivity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-[8px] border border-[#F3F4F6] shadow-[0px_4px_6px_0px_#0000001A]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#343A40]">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((item) => (
                <div key={item.id} className="flex items-center justify-between pb-4 border-b border-[#F3F4F6] last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Image src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
                    <p className="text-sm font-semibold text-[#343A40] whitespace-nowrap">{item.name}</p>
                  </div>
                  <p className="text-sm text-[#6B7280] hidden sm:block w-full ml-4">{item.action}</p>
                  <p className="text-sm text-[#9CA3AF] text-right whitespace-nowrap">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardOverviewPage