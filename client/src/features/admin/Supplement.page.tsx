import { SupplementFilters } from "@/components/supplement/supplement-filter";
import { SupplementGrid } from "@/components/supplement/supplement-grid";
import { SupplementToolbar } from "@/components/supplement/supplement-toolbar";
import { useSupplements } from "@/hooks/useSupplement";
import { useSupplementFilters } from "@/hooks/useSupplementFilters";

export default function SupplementPage() {
  const { sort, status, search, setParam } = useSupplementFilters();

  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useSupplements({ sort, status, search });

  if (isError) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-destructive">
        Failed to load supplements
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <SupplementToolbar isFetching={isFetching} onRefresh={refetch} />

      <SupplementFilters sort={sort} status={status} onChange={setParam} />

      <SupplementGrid supplements={data} loading={isLoading || isFetching} />
    </div>
  );
}
