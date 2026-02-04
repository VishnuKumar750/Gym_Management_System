import DataTable from "@/components/table";
import { Button } from "@/components/ui/button";
import { Receipt, RefreshCw } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import BillForm from "@/components/bill-form";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/axios/axios-api";
import { TableSkeleton } from "@/components/table-skeleton";
import Bill from "@/components/view-bill";

interface IBill {
  _id: string;
  billNumber: string;
  member: {
    _id: string;
    name: string;
    memberId: string;
  };
  package: {
    _id: string;
    packageName: string;
  };
  amount: number;
  discount: number;
  taxAmount: number;
  finalAmount: number;
  paymentDate: Date;
  paymentMethod: string;
  validFrom: Date;
  validUntil: Date;
  status: string;
  remarks?: string;
}

const BillColumns: ColumnDef<IBill>[] = [
  {
    accessorKey: "billNumber",
    header: "Bill Number",
    cell: ({ row }) => {
      return (
        <div className="font-mono text-sm font-medium text-foreground">
          {row.getValue("billNumber")}
        </div>
      );
    },
  },
  {
    accessorKey: "member",
    header: "Member",
    cell: ({ row }) => {
      const member = row.getValue("member") as IBill["member"];
      return (
        <div>
          <div className="font-medium text-foreground">{member.name}</div>
          <div className="text-xs text-muted-foreground">{member.memberId}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "package",
    header: "Package",
    cell: ({ row }) => {
      const pkg = row.getValue("package") as IBill["package"];
      return (
        <div className="text-sm">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
            {pkg.packageName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "finalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("finalAmount") as number;
      return (
        <div className="font-semibold text-foreground">
          ${amount.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      const methodStyles: Record<string, string> = {
        cash: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        card: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        upi: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        netbanking:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
        other: "bg-secondary text-secondary-foreground",
      };
      const methodLabels: Record<string, string> = {
        cash: "Cash",
        card: "Card",
        upi: "UPI",
        netbanking: "Net Banking",
        other: "Other",
      };

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            methodStyles[method] || methodStyles.other
          }`}
        >
          {methodLabels[method] || method}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => {
      const date = row.getValue("paymentDate") as Date;
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusStyles: Record<string, string> = {
        paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        pending:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        cancelled: "bg-secondary text-secondary-foreground",
      };
      const statusLabels: Record<string, string> = {
        paid: "Paid",
        pending: "Pending",
        overdue: "Overdue",
        cancelled: "Cancelled",
      };

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusStyles[status] || statusStyles.cancelled
          }`}
        >
          {statusLabels[status] || status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const bill = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Bill billId={bill._id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
// Fetch bills
const fetchBills = async (): Promise<IBill[]> => {
  const { data } = await api.get("/bills", {
    withCredentials: true,
  });

  return data.data.bills;
};

export default function Bills() {
  const {
    data: bills = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["bills"],
    queryFn: fetchBills,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <Receipt className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-semibold">Bills Receipts</h1>
              <p className="text-sm text-muted-foreground">
                Manage payment receipts and billing records
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

            {/* Create Bill */}
            <BillForm />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">All Bills</h2>
            <p className="text-sm text-muted-foreground">
              View and manage all payment records
            </p>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <div className="py-12 text-center text-destructive">
              Failed to load bills
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
