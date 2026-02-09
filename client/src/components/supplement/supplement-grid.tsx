import SupplementCard from "@/components/supplement-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ISupplement } from "@/types/supplement.types";

type Props = {
  supplements: ISupplement[];
  loading: boolean;
};

export function SupplementGrid({ supplements, loading }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!supplements.length) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        No supplements found
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {supplements.map((s) => (
        <SupplementCard key={s._id} data={s} />
      ))}
    </div>
  );
}
