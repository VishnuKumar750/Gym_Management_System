import {
  Activity,
  FileText,
  Package,
  Bell,
  Users,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { exportAnalyticsReport } from "@/utils/analytics-export";
import { AnalyticsLoading } from "@/components/analytics/analytics-loading";
import { StatusCard } from "@/components/analytics/status-card";
import { RevenueChart } from "@/components/analytics/revenue-chart";
import { MemberGrowthChart } from "@/components/analytics/member-growth-chart";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminAnalytics() {
  const { data, isLoading, error } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-6">
        <AnalyticsLoading />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
      </div>
    );
  }

  const revenueChartData = MONTHS.map((m, i) => ({
    month: m,
    revenue:
      data.charts.revenueByMonth.find((r) => r._id === i + 1)?.revenue || 0,
  }));

  const memberGrowthData = MONTHS.map((m, i) => ({
    month: m,
    members: data.charts.memberGrowth.find((r) => r._id === i + 1)?.count || 0,
  }));

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Admin Analytics</h1>
          <p className="text-muted-foreground">
            Real-time insights and performance metrics
          </p>
        </div>

        <button
          onClick={() => exportAnalyticsReport(data)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Export Report
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total Users"
          value={data.users.totalUsers}
          icon={<Users />}
        />
        <StatusCard
          title="Members"
          value={data.users.members}
          icon={<Activity />}
        />
        <StatusCard
          title="Revenue"
          value={`${(data.billing.totalRevenue / 1000).toFixed(1)}k`}
          icon={<IndianRupee />}
        />
        <StatusCard
          title="Pending Bills"
          value={data.billing.pendingBills}
          icon={<AlertCircle />}
        />
        <StatusCard
          title="Supplements"
          value={data.supplements.totalSupplements}
          icon={<Package />}
        />
        <StatusCard
          title="Diet Plans"
          value={data.dietPlans.totalDietPlans}
          icon={<FileText />}
        />
        <StatusCard
          title="Notifications"
          value={data.notifications.totalNotifications}
          icon={<Bell />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueChartData} />
        <MemberGrowthChart data={memberGrowthData} />
      </div>
    </div>
  );
}
