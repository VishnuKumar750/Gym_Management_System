import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import EditMember from "@/components/edit-member";
import DeleteMember from "@/components/delete-member";
import DietPlanForm from "@/components/diet-form";

import type { Member } from "@/types/member.types";

export const MemberColumns: ColumnDef<Member>[] = [
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
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
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
      const status = row.original.status;

      const styles: Record<string, string> = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-secondary text-secondary-foreground",
        suspended: "bg-red-100 text-red-800",
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
      const member = row.original;

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
              <EditMember memberData={member} />
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <DietPlanForm id={member._id} />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="text-destructive">
              <DeleteMember memberId={member._id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
