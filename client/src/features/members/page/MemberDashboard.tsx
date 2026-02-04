import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Bell, CreditCard, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";

interface AnalyticsResponse {
  summary: {
    totalBills: number;
    totalSpent: number;
    totalNotifications: number;
    unreadNotifications: number;
    pendingDues: number;
    pendingDuesAmount: number;
    activePackage: string | null;
    memberSince: string;
  };
  chartData: {
    monthlySpending: {
      month: string;
      totalSpent: number;
      billCount: number;
    }[];
    recentBills: {
      billNumber: string;
      amount: number;
      paymentDate: string;
      status: string;
    }[];
  };
  quickStats: {
    thisMonthSpent: number;
    lastMonthSpent: number;
    averageMonthlySpent: number;
    paymentMethods: {
      method: string;
      count: number;
      total: number;
    }[];
  };
}

const PIE_COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

const getMemberAnalytics = async () => {
  const res = await api.get("/member/analytics", { withCredentials: true });

  console.log(res.data);
  return res.data;
};

export default function MemberAnalyticsPage() {
  const { data, isLoading } = useQuery<AnalyticsResponse>({
    queryKey: ["member-analytics"],
    queryFn: getMemberAnalytics,
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

  const { summary, chartData, quickStats } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Member Analytics</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Active Package:</span>
          {summary.activePackage ? (
            <Badge variant="secondary">{summary.activePackage}</Badge>
          ) : (
            <span>None</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Spent"
          value={`₹${summary.totalSpent}`}
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          title="Pending Dues"
          value={`₹${summary.pendingDuesAmount}`}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatCard
          title="Unread Alerts"
          value={summary.unreadNotifications}
          icon={<Bell className="h-5 w-5" />}
        />
        <StatCard
          title="Avg Monthly Spend"
          value={`₹${quickStats.averageMonthlySpent}`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalSpent" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={quickStats.paymentMethods}
                  dataKey="total"
                  nameKey="method"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {quickStats.paymentMethods.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.recentBills.map((bill) => (
              <div
                key={bill.billNumber}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">#{bill.billNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(bill.paymentDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{bill.amount}</p>
                  <Badge
                    variant={bill.status === "paid" ? "default" : "destructive"}
                  >
                    {bill.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MiniStat label="This Month" value={`₹${quickStats.thisMonthSpent}`} />
        <MiniStat label="Last Month" value={`₹${quickStats.lastMonthSpent}`} />
        <MiniStat
          label="Member Since"
          value={new Date(summary.memberSince).toLocaleDateString()}
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
