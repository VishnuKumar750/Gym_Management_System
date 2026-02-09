import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ViewDiet from "@/components/view-diet";
import type { MemberDiet } from "@/validators/diet.schema";

export const DietColumns: ColumnDef<MemberDiet>[] = [
  {
    header: "Member ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.original.member.memberId}
      </span>
    ),
  },
  {
    header: "Member Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.member.name}</span>
    ),
  },
  {
    accessorKey: "planName",
    header: "Plan Name",
  },
  {
    accessorKey: "goal",
    header: "Goal",
    cell: ({ row }) => {
      const labels: Record<string, string> = {
        weight_loss: "Weight Loss",
        muscle_gain: "Muscle Gain",
        maintenance: "Maintenance",
        athletic_performance: "Athletic Performance",
      };

      return (
        <span className="px-2 py-0.5 rounded text-xs bg-secondary">
          {labels[row.original.goal]}
        </span>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) =>
      row.original.endDate
        ? new Date(row.original.endDate).toLocaleDateString()
        : "—",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="text-xs font-medium text-green-600">Active</span>
      ) : (
        <span className="text-xs text-muted-foreground">Inactive</span>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const diet = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <ViewDiet diet={diet} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
