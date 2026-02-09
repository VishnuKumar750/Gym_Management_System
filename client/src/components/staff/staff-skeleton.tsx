export function StaffTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="h-12 bg-muted/50 animate-pulse" />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-16 bg-muted/30 animate-pulse border-t" />
      ))}
      <div className="h-12 bg-muted/50 animate-pulse mt-4" />
    </div>
  );
}
