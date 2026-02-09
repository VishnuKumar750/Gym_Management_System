import { useDiets } from "@/hooks/useDiets";
import { DietHeader } from "@/components/diet/diet-header";
import { DietTable } from "@/components/diet/diet-table";

export default function Diet() {
  const { data = [], isLoading, isError, isFetching, refetch } = useDiets();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-muted-foreground">
        Loading diet plans…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-destructive">
        Failed to load diet plans
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DietHeader isFetching={isFetching} onRefresh={refetch} />

      <div className="rounded-lg border bg-card">
        <div className="px-6 py-4 border-b">
          <h4 className="text-sm font-medium">Assigned Diets</h4>
          <p className="text-xs text-muted-foreground">
            Search diets by member name
          </p>
        </div>

        <div className="p-4">
          <DietTable data={data} />
        </div>
      </div>
    </div>
  );
}
