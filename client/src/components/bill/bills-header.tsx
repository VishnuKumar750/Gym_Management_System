import { Receipt, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import BillForm from "@/components/bill-form";

type Props = {
  isFetching: boolean;
  onRefresh: () => void;
};

export function BillsHeader({ isFetching, onRefresh }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex items-center gap-3">
        <Receipt className="w-8 h-8" />
        <div>
          <h1 className="text-xl font-semibold">Bills Receipts</h1>
          <p className="text-sm text-muted-foreground">
            Manage payment receipts and billing records
          </p>
        </div>
      </div>

      <div className="flex gap-2">
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

        <BillForm />
      </div>
    </div>
  );
}
