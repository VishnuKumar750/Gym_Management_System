import { Package2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddPackageForm from "@/components/fee-package-form";

type Props = {
  isFetching: boolean;
  onRefresh: () => void;
};

export function PackagesHeader({ isFetching, onRefresh }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Package2 className="w-8 h-8" />
        <div>
          <h1 className="text-xl font-semibold">Packages</h1>
          <p className="text-sm text-muted-foreground">
            View, add, edit, and manage membership packages
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

        <AddPackageForm />
      </div>
    </div>
  );
}
