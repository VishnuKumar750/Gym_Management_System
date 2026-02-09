import { type ColumnDef } from "@tanstack/react-table";
import { Receipt, RefreshCw, AlertCircle } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DataTable from "@/components/table";
import Bill from "@/components/view-bill";
import { TableSkeleton } from "@/components/table-skeleton";
import { getMemberBills } from "@/api/user/user.api";
import type { IBill } from "@/types/bill.types";

const BillColumns: ColumnDef<IBill>[] = [
  {
    accessorKey: "billNumber",
    header: "Bill Number",
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {row.getValue("billNumber")}
      </div>
    ),
  },
  {
    accessorKey: "package",
    header: "Package",
    cell: ({ row }) => {
      const pkg = row.original.packageId;
      return (
        <span className="text-xs rounded-md border px-2 py-0.5">
          {pkg.packageName}
        </span>
      );
    },
  },
  {
    accessorKey: "finalAmount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-semibold">
        ${Number(row.getValue("finalAmount")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => (
      <span className="text-xs rounded-md border px-2 py-0.5 capitalize">
        {row.getValue("paymentMethod")}
      </span>
    ),
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => {
      const date = row.getValue("paymentDate") as Date;
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="text-xs rounded-full border px-2 py-0.5 capitalize">
        {row.getValue("status")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const bill = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Bill bill={bill} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function BillReceipts() {
  const {
    data: bills = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["bills"],
    queryFn: getMemberBills,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="h-7 w-7 text-muted-foreground" />
            <div>
              <h1 className="text-xl font-semibold">Bill Receipts</h1>
              <p className="text-sm text-muted-foreground">
                View and download your billing records
              </p>
            </div>
          </div>

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

        {/* Table Card */}
        <div className="bg-card border rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Your Bills</h2>
            <p className="text-sm text-muted-foreground">
              All generated bills and receipts
            </p>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <AlertCircle className="h-6 w-6 mb-2" />
              Failed to load bills
            </div>
          ) : bills.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <Receipt className="h-6 w-6 mb-2" />
              No bills found
            </div>
          ) : (
            <DataTable
              columns={BillColumns}
              data={bills}
              searchKey="billNumber"
              searchPlaceholder="Search by bill number..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
