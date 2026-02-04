import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  DollarSign,
  FileText,
  Package,
  Bell,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/axios/axios-api";

/* ================= TYPES ================= */

interface AnalyticsData {
  users: {
    totalUsers: number;
    activeUsers: number;
    members: number;
    staff: number;
    trainers: number;
  };
  supplements: {
    totalSupplements: number;
    availableSupplements: number;
    outOfStock: number;
  };
  packages: {
    totalPackages: number;
    activePackages: number;
  };
  notifications: {
    totalNotifications: number;
    sentNotifications: number;
    scheduledNotifications: number;
  };
  dietPlans: {
    totalDietPlans: number;
    activeDietPlans: number;
  };
  billing: {
    totalBills: number;
    paidBills: number;
    pendingBills: number;
    overdueBills: number;
    totalRevenue: number;
  };
  charts: {
    revenueByMonth: Array<{ _id: number; revenue: number }>;
    memberGrowth: Array<{ _id: number; count: number }>;
  };
}

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}

/* ================= API ================= */

const fetchAnalytics = async (): Promise<AnalyticsData> => {
  const res = await api.get("/user/admin/analytics/", {
    withCredentials: true,
  });
  return res.data;
};

/* ================= HELPERS ================= */

const MONTH_NAMES = [
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

function exportAnalyticsReport(data: AnalyticsData) {
  const rows = [
    ["Metric", "Value"],
    ["Total Users", data.users.totalUsers],
    ["Active Users", data.users.activeUsers],
    ["Members", data.users.members],
    ["Trainers", data.users.trainers],
    ["Staff", data.users.staff],
    ["Total Revenue", data.billing.totalRevenue],
    ["Paid Bills", data.billing.paidBills],
    ["Pending Bills", data.billing.pendingBills],
    ["Overdue Bills", data.billing.overdueBills],
    ["Total Supplements", data.supplements.totalSupplements],
    ["Out of Stock Supplements", data.supplements.outOfStock],
    ["Total Packages", data.packages.totalPackages],
    ["Active Packages", data.packages.activePackages],
    ["Total Diet Plans", data.dietPlans.totalDietPlans],
    ["Active Diet Plans", data.dietPlans.activeDietPlans],
    ["Total Notifications", data.notifications.totalNotifications],
    ["Scheduled Notifications", data.notifications.scheduledNotifications],
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "admin-analytics-report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ================= COMPONENTS ================= */

function StatusCard({ title, value, subtitle, icon }: StatusCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="rounded-lg bg-muted p-3">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsLoading() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function AdminAnalytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: fetchAnalytics,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <AnalyticsLoading />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Failed to load analytics
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const revenueChartData = MONTH_NAMES.map((month, i) => ({
    month,
    revenue:
      data.charts.revenueByMonth.find((m) => m._id === i + 1)?.revenue || 0,
  }));

  const memberGrowthData = MONTH_NAMES.map((month, i) => ({
    month,
    members: data.charts.memberGrowth.find((m) => m._id === i + 1)?.count || 0,
  }));

  const userActiveRate =
    data.users.totalUsers > 0
      ? ((data.users.activeUsers / data.users.totalUsers) * 100).toFixed(1)
      : "0";

  const billPaidRate =
    data.billing.totalBills > 0
      ? ((data.billing.paidBills / data.billing.totalBills) * 100).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Admin Analytics
            </h1>
            <p className="text-lg text-muted-foreground">
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

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            title="Total Users"
            value={data.users.totalUsers}
            subtitle={`${userActiveRate}% active`}
            icon={<Users />}
          />
          <StatusCard
            title="Members"
            value={data.users.members}
            subtitle={`${data.users.trainers} trainers`}
            icon={<Activity />}
          />
          <StatusCard
            title="Total Revenue"
            value={`$${(data.billing.totalRevenue / 1000).toFixed(1)}k`}
            subtitle={`${billPaidRate}% collected`}
            icon={<DollarSign />}
          />
          <StatusCard
            title="Pending Bills"
            value={data.billing.pendingBills}
            subtitle={`${data.billing.overdueBills} overdue`}
            icon={<AlertCircle />}
          />
          <StatusCard
            title="Supplements"
            value={data.supplements.totalSupplements}
            subtitle={`${data.supplements.availableSupplements} available`}
            icon={<Package />}
          />
          <StatusCard
            title="Out of Stock"
            value={data.supplements.outOfStock}
            subtitle="Needs restocking"
            icon={<AlertCircle />}
          />
          <StatusCard
            title="Diet Plans"
            value={data.dietPlans.totalDietPlans}
            subtitle={`${data.dietPlans.activeDietPlans} active`}
            icon={<FileText />}
          />
          <StatusCard
            title="Notifications"
            value={data.notifications.totalNotifications}
            subtitle={`${data.notifications.scheduledNotifications} scheduled`}
            icon={<Bell />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer height={320}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="revenue" stroke="#334155" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Member Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer height={320}>
                <BarChart data={memberGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="members" fill="#475569" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
