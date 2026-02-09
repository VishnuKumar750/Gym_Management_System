import { usePackages } from "@/hooks/usePackages";
import { PackagesHeader } from "@/components/packages/packages-header";
import { PackagesTable } from "@/components/packages/packages-table";
import { TableSkeleton } from "@/components/table-skeleton";

export default function FeePackages() {
  const { data = [], isLoading, isError, isFetching, refetch } = usePackages();

  if (isError) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-destructive">
        Failed to load packages
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PackagesHeader isFetching={isFetching} onRefresh={refetch} />

      <div className="rounded-lg border bg-card">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Packages List</h2>
          <p className="text-sm text-muted-foreground">
            Browse and search available packages
          </p>
        </div>

        <div className="p-4">
          {isLoading ? <TableSkeleton /> : <PackagesTable data={data} />}
        </div>
      </div>
    </div>
  );
}
