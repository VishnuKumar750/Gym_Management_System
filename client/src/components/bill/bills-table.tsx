import DataTable from "@/components/table";
import { TableSkeleton } from "@/components/table-skeleton";
import { BillColumns } from "@/components/bill/bill-columns";
import type { IBill } from "@/types/bill.types";

type Props = {
  data: IBill[];
  isLoading: boolean;
  isError: boolean;
};

export function BillsTable({ data, isLoading, isError }: Props) {
  if (isLoading) return <TableSkeleton />;

  if (isError) {
    return (
      <div className="py-12 text-center text-destructive">
        Failed to load bills
      </div>
    );
  }

  return (
    <DataTable
      columns={BillColumns}
      data={data}
      searchKey="billNumber"
      searchPlaceholder="Search by bill number..."
    />
  );
}
