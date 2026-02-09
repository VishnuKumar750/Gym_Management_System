import type { AnalyticsData } from "@/types/analytics.types";

export function exportAnalyticsReport(data: AnalyticsData) {
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

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "admin-analytics-report.csv";
  link.click();
}
