import { NotificationsHeader } from "@/components/notification/notification-header";
import { NotificationsTable } from "@/components/notification/notification-table";
import { useNotifications } from "@/hooks/useNotification";

export default function NotificationPage() {
  const {
    data = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useNotifications();

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
        <NotificationsHeader isFetching={isFetching} onRefresh={refetch} />

        <div className="rounded-lg border bg-card">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              View and search sent notifications
            </p>
          </div>

          <div className="p-4">
            <NotificationsTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
