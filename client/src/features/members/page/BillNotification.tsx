import api from "@/axios/axios-api";
import DataTable from "@/components/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  Bell,
  CalendarClock,
  RefreshCw,
  Users,
} from "lucide-react";

interface INotification {
  _id: string;
  title: string;
  message: string;
  type:
    | "payment_due"
    | "payment_received"
    | "general"
    | "holiday"
    | "event"
    | "urgent";

  sentDate?: string;
  scheduledDate?: string;
  isSent?: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
}

const NotificationColumns: ColumnDef<INotification>[] = [
  {
    accessorKey: "title",
    header: "Notification",
    cell: ({ row }) => {
      const { title, type } = row.original;

      const typeIcons = {
        payment_due: AlertCircle,
        payment_received: Bell,
        general: Bell,
        holiday: Users,
        event: Users,
        urgent: AlertCircle,
      };

      const Icon = typeIcons[type] ?? Bell;

      return (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-md">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="font-medium">{title}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div className="max-w-xs truncate text-sm text-muted-foreground">
        {row.original.message}
      </div>
    ),
  },

  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;

      const styles: Record<string, string> = {
        payment_due: "bg-yellow-100 text-yellow-800",
        payment_received: "bg-green-100 text-green-800",
        general: "bg-blue-100 text-blue-800",
        holiday: "bg-purple-100 text-purple-800",
        event: "bg-indigo-100 text-indigo-800",
        urgent: "bg-red-100 text-red-800",
      };

      const labels: Record<string, string> = {
        payment_due: "Payment Due",
        payment_received: "Payment Received",
        general: "General",
        holiday: "Holiday",
        event: "Event",
        urgent: "Urgent",
      };

      return (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            styles[type]
          }`}
        >
          {labels[type]}
        </span>
      );
    },
  },

  {
    header: "sent Date",
    cell: ({ row }) => {
      const { isSent, sentDate, scheduledDate } = row.original;

      if (isSent && sentDate) {
        return (
          <span className="text-sm text-muted-foreground">
            Sent on{" "}
            {new Date(sentDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      }

      if (!isSent && scheduledDate) {
        return (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarClock className="w-4 h-4" />
            Scheduled
          </div>
        );
      }

      return <span className="text-sm text-muted-foreground">Draft</span>;
    },
  },

  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.createdBy.name}
      </span>
    ),
  },
];

// Fetch notifications
const fetchNotifications = async (): Promise<INotification[]> => {
  const { data } = await api.get("/member/notifications", {
    withCredentials: true,
  });
  return data.data;
};

export default function MemberNotifications() {
  const {
    data: notifications = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Loading notifications…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen grid place-items-center text-destructive">
        Failed to load notifications
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 " />

            <div>
              <h1 className="text-xl font-semibold leading-tight">
                Notifications
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and send notifications to gym members
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Refetch */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              className="border"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-lg border bg-card">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              View and search sent notifications
            </p>
          </div>

          <div className="p-4">
            <DataTable
              columns={NotificationColumns}
              data={notifications}
              searchKey="title"
              searchPlaceholder="Search notifications..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
