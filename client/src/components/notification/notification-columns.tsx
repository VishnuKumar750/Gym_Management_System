import type { INotification } from "@/types/notification.types";
import { type ColumnDef } from "@tanstack/react-table";
import { Bell, Users, AlertCircle, CalendarClock } from "lucide-react";

export const NotificationColumns: ColumnDef<INotification>[] = [
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
    header: "Member",
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.recipient?.name ?? "-"}
      </div>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const { isSent, sentDate } = row.original;

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

      if (!isSent) {
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
