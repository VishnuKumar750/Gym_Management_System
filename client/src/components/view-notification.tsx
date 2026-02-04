"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Bell, AlertCircle, Users, CalendarClock, Eye } from "lucide-react";
import api from "@/axios/axios-api";
import { Button } from "./ui/button";

/* ----------------------------- TYPES ----------------------------- */

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
  targetAudience: "all" | "active_members" | "specific";
  recipients?: { _id: string; name: string }[];
  isSent: boolean;
  sentDate?: string;
  scheduledDate?: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

/* ----------------------------- API ----------------------------- */

const fetchNotification = async (id: string) => {
  const { data } = await api.get(`/notification/${id}`, {
    withCredentials: true,
  });
  return data.data;
};

/* ----------------------------- COMPONENT ----------------------------- */

export default function ViewNotifications({
  notificationId,
}: {
  notificationId: string;
}) {
  const { data, isLoading, isError } = useQuery<INotification>({
    queryKey: ["notification", notificationId],
    queryFn: () => fetchNotification(notificationId),
    enabled: !!notificationId,
  });

  const typeIcons = {
    payment_due: AlertCircle,
    payment_received: Bell,
    general: Bell,
    holiday: Users,
    event: Users,
    urgent: AlertCircle,
  };

  const Icon = data ? typeIcons[data.type] : Bell;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} className="w-full">
          <Eye className="w-4 h-4" />
          view notification
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md space-y-6">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-muted-foreground" />
            Notification Details
          </SheetTitle>
        </SheetHeader>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Failed to load notification
          </p>
        )}

        {data && (
          <div className="space-y-5">
            {/* Title */}
            <div>
              <h3 className="text-lg font-semibold">{data.title}</h3>
              <p className="text-sm text-muted-foreground">
                Created by {data.createdBy.name}
              </p>
            </div>

            <Separator />

            {/* Message */}
            <div>
              <p className="text-sm leading-relaxed text-foreground">
                {data.message}
              </p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <Badge variant="secondary">{data.type}</Badge>
              </div>

              <div>
                <p className="text-muted-foreground">Audience</p>
                <span>
                  {data.targetAudience === "all" && "All Members"}
                  {data.targetAudience === "active_members" && "Active Members"}
                  {data.targetAudience === "specific" &&
                    `Specific (${data.recipients?.length ?? 0})`}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {data.isSent && data.sentDate ? (
                <>
                  <Bell className="w-4 h-4" />
                  Sent on {new Date(data.sentDate).toLocaleDateString()}
                </>
              ) : data.scheduledDate ? (
                <>
                  <CalendarClock className="w-4 h-4" />
                  Scheduled for{" "}
                  {new Date(data.scheduledDate).toLocaleDateString()}
                </>
              ) : (
                "Draft"
              )}
            </div>

            {/* Recipients */}
            {data.targetAudience === "specific" &&
              data.recipients &&
              data.recipients.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Recipients</p>
                  <div className="flex flex-wrap gap-2">
                    {data.recipients.map((r) => (
                      <Badge key={r._id} variant="outline">
                        {r.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
