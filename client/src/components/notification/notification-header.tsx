import { Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddNotification from "@/components/add-notification";

type Props = {
  isFetching: boolean;
  onRefresh: () => void;
};

export function NotificationsHeader({ isFetching, onRefresh }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Bell className="w-8 h-8" />
        <div>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Manage and send notifications to gym members
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isFetching}
          className="border"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>

        <AddNotification />
      </div>
    </div>
  );
}
