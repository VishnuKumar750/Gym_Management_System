import { MembersHeader } from "@/components/member/member-header";
import { MembersTableSkeleton } from "@/components/member/member-skeleton";
import { MembersTable } from "@/components/member/member-table";
import { useMembers } from "@/hooks/useMember";

export default function MembersPage() {
  const { data = [], isLoading, isError, isFetching, refetch } = useMembers();

  if (isError) {
    return (
      <div className="text-sm text-destructive">Failed to load members</div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <MembersHeader isFetching={isFetching} onRefresh={refetch} />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Members List</h2>
            <p className="text-sm text-muted-foreground">
              View and search registered members
            </p>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? <MembersTableSkeleton /> : <MembersTable data={data} />}
        </div>
      </div>
    </div>
  );
}
