import { UtensilsCrossed, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isFetching: boolean;
  onRefresh: () => void;
};

export function DietHeader({ isFetching, onRefresh }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <UtensilsCrossed className="w-8 h-8" />
        <div>
          <h1 className="text-xl font-semibold">Diet Plans</h1>
          <p className="text-sm text-muted-foreground">
            View and manage assigned diet plans
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRefresh}
        disabled={isFetching}
        className="border"
      >
        <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
