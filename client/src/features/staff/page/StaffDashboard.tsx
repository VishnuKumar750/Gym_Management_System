import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Users, Wallet, TrendingUp, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/axios/axios-api";

interface StaffMemberAnalyticsResponse {
  members: {
    totalMembers: number;
    activeMembers: number;
  };
  billing: {
    totalBills: number;
    paidBills: number;
    pendingBills: number;
    totalRevenue: number;
  };
  charts: {
    revenueByMonth: { _id: number; revenue: number }[];
    memberGrowth: { _id: number; count: number }[];
  };
}

const getStaffMemberAnalytics = async () => {
  const res = await api.get("/user/staff/analytics", { withCredentials: true });
  return res.data.data;
};

export default function StaffAnalyticsPage() {
  const { data, isLoading } = useQuery<StaffMemberAnalyticsResponse>({
    queryKey: ["staff-member-analytics"],
    queryFn: getStaffMemberAnalytics,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!data) return null;

  const { members, billing, charts } = data;

  const revenueChartData = charts.revenueByMonth.map((m) => ({
    month: m._id,
    revenue: m.revenue,
  }));

  const memberGrowthData = charts.memberGrowth.map((m) => ({
    month: m._id,
    members: m.count,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Staff Member Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Member performance and billing insights
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={members.totalMembers}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Active Members"
          value={members.activeMembers}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${billing.totalRevenue}`}
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          title="Total Bills"
          value={billing.totalBills}
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (This Year)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="members" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MiniStat label="Paid Bills" value={billing.paidBills} />
        <MiniStat label="Pending Bills" value={billing.pendingBills} />
        <MiniStat
          label="Revenue per Member"
          value={`₹${members.totalMembers ? Math.round(billing.totalRevenue / members.totalMembers) : 0}`}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
