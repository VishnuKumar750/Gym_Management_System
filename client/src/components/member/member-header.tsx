import { User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddMember from "@/components/add-member";

type Props = {
  isFetching: boolean;
  onRefresh: () => void;
};

export function MembersHeader({ isFetching, onRefresh }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <User className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-xl font-semibold">Members</h1>
          <p className="text-sm text-muted-foreground">
            Manage gym members and their diet plans
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

        <AddMember />
      </div>
    </div>
  );
}
