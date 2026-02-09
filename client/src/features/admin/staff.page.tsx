import { useStaff } from "@/hooks/useStaff";
import { StaffHeader } from "@/components/staff/staff-header";
import { StaffTable } from "@/components/staff/staff-table";
import { StaffTableSkeleton } from "@/components/staff/staff-skeleton";

export default function StaffPage() {
  const { data = [], isLoading, isError, isFetching, refetch } = useStaff();

  if (isError) {
    return <div className="text-sm text-destructive">Failed to load staff</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <StaffHeader isFetching={isFetching} onRefresh={refetch} />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Staff List</h2>
            <p className="text-sm text-muted-foreground">
              View and search registered staff
            </p>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? <StaffTableSkeleton /> : <StaffTable data={data} />}
        </div>
      </div>
    </div>
  );
}
