import { BillsHeader } from "@/components/bill/bills-header";
import { BillsTable } from "@/components/bill/bills-table";
import { useBills } from "@/hooks/useBills";

export default function Bills() {
  const { data = [], isLoading, isError, isFetching, refetch } = useBills();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BillsHeader isFetching={isFetching} onRefresh={refetch} />

      <div className="bg-card border rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">All Bills</h2>
          <p className="text-sm text-muted-foreground">
            View and manage all payment records
          </p>
        </div>

        <BillsTable data={data} isLoading={isLoading} isError={isError} />
      </div>
    </div>
  );
}
