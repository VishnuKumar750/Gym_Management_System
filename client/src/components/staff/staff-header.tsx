import { User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddStaff from "@/components/add-staff";

type Props = {
  isFetching: boolean;
  onRefresh: () => void;
};

export function StaffHeader({ isFetching, onRefresh }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <User className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-xl font-semibold">Staffs</h1>
          <p className="text-sm text-muted-foreground">
            Manage gym staff and their diet plans
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

        <AddStaff />
      </div>
    </div>
  );
}
