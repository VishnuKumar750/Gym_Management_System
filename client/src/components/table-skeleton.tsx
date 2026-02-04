// components/table-skeleton.tsx
export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-full rounded-md bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}
