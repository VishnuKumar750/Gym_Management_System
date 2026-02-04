import { LucidePlusCircle, Package, RefreshCw, Package2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/table";
import { Button } from "@/components/ui/button";
import PackageForm from "@/components/fee-package-form";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";
import { TableSkeleton } from "@/components/table-skeleton";

// Package Type
export interface Package {
  _id: string;
  packageName: string;
  duration: number;
  price: number;
  features: string[];
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// Column Definitions
const packageColumns: ColumnDef<Package>[] = [
  {
    accessorKey: "packageName",
    header: "Package Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("packageName")}</div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      return (
        <span className="text-muted-foreground">
          {duration} {duration === 1 ? "Month" : "Months"}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <span className="font-medium">₹{price}</span>;
    },
  },
  {
    accessorKey: "features",
    header: "Features",
    cell: ({ row }) => {
      const features = row.getValue("features") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {features.slice(0, 2).map((f, i) => (
            <span key={i} className="px-2 py-0.5 text-xs rounded bg-secondary">
              {f}
            </span>
          ))}
          {features.length > 2 && (
            <span className="px-2 py-0.5 text-xs rounded bg-secondary">
              +{features.length - 2}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.getValue("isActive") ? (
        <span className="text-xs font-medium text-green-600">Active</span>
      ) : (
        <span className="text-xs text-muted-foreground">Inactive</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.getValue("createdAt") as string).toLocaleDateString()}
      </span>
    ),
  },
];

// Fetch packages function
const fetchPackages = async (): Promise<Package[]> => {
  const { data } = await api.get("/packages", {
    withCredentials: true,
  });

  return data.data.packages; // adjust if your backend shape differs
};

export default function FeePackages() {
  const {
    data: packages = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-muted-foreground">
        Loading packages…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-destructive">
        Failed to load packages
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Package2 className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-semibold leading-tight">Packages</h1>
            <p className="text-sm text-muted-foreground">
              View, add, edit, and manage membership packages
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Refetch */}
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

          {/* Add Package */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <LucidePlusCircle className="w-4 h-4" />
                Add Package
              </Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-md overflow-y-auto">
              <PackageForm />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-lg border bg-card">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Packages List</h2>
          <p className="text-sm text-muted-foreground">
            Browse and search available packages
          </p>
        </div>

        <div className="p-4">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              columns={packageColumns}
              data={packages}
              searchKey="packageName"
              searchPlaceholder="Search packages..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
