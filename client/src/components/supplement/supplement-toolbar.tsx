import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AddSupplement from "@/components/add-supplement";
import TypeaheadSearch from "@/components/search-component";

type Props = {
  isFetching: boolean;
  onRefresh: () => void;
};

export function SupplementToolbar({ isFetching, onRefresh }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="w-full max-w-md space-y-1">
        <h4 className="text-xs font-medium text-muted-foreground">
          Search supplements
        </h4>
        <TypeaheadSearch
          queryKey="search"
          placeholder="Search products..."
          onSearch={() => {}}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isFetching}
        >
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
        </Button>
        <AddSupplement />
      </div>
    </div>
  );
}
