// Example usage in parent page
import DataTable from "@/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import { User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/api/user/user.api";
import { TableSkeleton } from "@/components/table-skeleton";

export interface Member {
  _id: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  assignedPackage?: {
    _id: string;
    packageName: string;
  };
  createdAt: string;
}

const MemberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "memberId",
    header: "Member ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.getValue("memberId")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("email")}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("phone")}
      </span>
    ),
  },
  {
    accessorKey: "assignedPackage",
    header: "Package",
    cell: ({ row }) => {
      const pkg = row.original.assignedPackage;

      return pkg ? (
        <span className="inline-flex px-2 py-0.5 rounded text-xs bg-secondary">
          {pkg.packageName}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.getValue("createdAt") as string).toLocaleDateString(
          "en-US",
          { month: "short", day: "numeric", year: "numeric" },
        )}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const styles: Record<string, string> = {
        active:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        inactive: "bg-secondary text-secondary-foreground",
        suspended:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      };

      return (
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
            styles[status]
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
];

export default function MemberRecords() {
  const {
    data: members = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isError) {
    return (
      <div className="text-sm text-destructive">Failed to load members</div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <User className="w-8 h-8 text-primary" />

          <div>
            <h1 className="text-xl font-semibold leading-tight">Members</h1>
            <p className="text-sm text-muted-foreground">
              Manage gym members and their diet plans
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Table Card */}
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
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              columns={MemberColumns}
              data={members}
              searchKey="name"
              searchPlaceholder="Search members..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
