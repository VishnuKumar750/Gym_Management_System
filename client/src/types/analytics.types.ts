export type RevenueByMonth = {
  _id: number;
  revenue: number;
};

export type MemberGrowth = {
  _id: number;
  count: number;
};

export interface AnalyticsData {
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
    revenueByMonth: RevenueByMonth[];
    memberGrowth: MemberGrowth[];
  };
}
