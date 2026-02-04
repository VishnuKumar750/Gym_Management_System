// Example usage in parent page
import DataTable from "@/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, User, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import api from "@/axios/axios-api";
import { useQuery } from "@tanstack/react-query";
import AddStaff from "@/components/add-staff";
import DeleteStaff from "@/components/delete-staff";
import EditStaff from "@/components/edit-staff";

function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="h-12 bg-muted/50 animate-pulse" /> {/* Header row */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-16 bg-muted/30 animate-pulse border-t" />
      ))}
      <div className="h-12 bg-muted/50 animate-pulse mt-4" /> {/* Pagination */}
    </div>
  );
}

export interface Staff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
}

const StaffColumns: ColumnDef<Staff>[] = [
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="max-w-44">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <EditStaff staffId={staff._id} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-destructive">
              <DeleteStaff staffId={staff._id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// api function
const getStaff = async () => {
  const { data } = await api.get("/user/staffs", {
    withCredentials: true,
  });
  return data.data.users;
};

export default function StaffPage() {
  const {
    data: staffs = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: getStaff,
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
            <h1 className="text-xl font-semibold leading-tight">Staffs</h1>
            <p className="text-sm text-muted-foreground">
              Manage gym staff and their diet plans
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

          {/*add staff*/}
          <AddStaff />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Staff List</h2>
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
              columns={StaffColumns}
              data={staffs}
              searchKey="name"
              searchPlaceholder="Search members..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
