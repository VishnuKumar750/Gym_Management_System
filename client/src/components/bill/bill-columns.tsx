import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Bill from "@/components/view-bill";
import UpdateBill from "@/components/update-bill";
import type { IBill } from "@/types/bill.types";

export const BillColumns: ColumnDef<IBill>[] = [
  {
    accessorKey: "billNumber",
    header: "Bill Number",
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {row.original.billNumber}
      </div>
    ),
  },
  {
    accessorKey: "member",
    header: "Member",
    cell: ({ row }) => {
      const member = row.original.memberId;
      return <div className="font-medium">{member ? member.name : ""}</div>;
    },
  },
  {
    accessorKey: "package",
    header: "Package",
    cell: ({ row }) => {
      const pkg = row.original.packageId;
      return (
        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-secondary">
          {pkg ? pkg.packageName : ""}
        </span>
      );
    },
  },
  {
    accessorKey: "finalAmount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-semibold">
        ${Number(row.original.amount).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      const styles: Record<string, string> = {
        cash: "bg-green-100 text-green-800",
        card: "bg-blue-100 text-blue-800",
        upi: "bg-purple-100 text-purple-800",
        netbanking: "bg-indigo-100 text-indigo-800",
        other: "bg-secondary",
      };
      return (
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            styles[method] ?? styles.other
          }`}
        >
          {method}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentDate",
    header: "Date",
    cell: ({ row }) =>
      row.original.paymentDate
        ? new Date(row.original.paymentDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const styles: Record<string, string> = {
        paid: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        overdue: "bg-red-100 text-red-800",
        cancelled: "bg-secondary",
      };
      return (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            styles[status] ?? styles.cancelled
          }`}
        >
          {status}
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
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Bill bill={bill} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <UpdateBill billId={bill._id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
