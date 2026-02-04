import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, RefreshCw, UtensilsCrossed } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/table";
import api from "@/axios/axios-api";
import { useQuery } from "@tanstack/react-query";
import ViewDiet from "@/components/view-diet";

export interface MemberDiet {
  _id: string;
  member: {
    _id: string;
    memberId: string;
    name: string;
  };
  planName: string;
  goal: "weight_loss" | "muscle_gain" | "maintenance" | "athletic_performance";
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

const fetchDiets = async (): Promise<MemberDiet[]> => {
  const { data } = await api.get("/dietPlan", {
    withCredentials: true,
  });

  return data.data; // adjust if backend wraps response
};

const DietColumns: ColumnDef<MemberDiet>[] = [
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
              <ViewDiet dietId={diet._id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Diet() {
  const {
    data: diets = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["diets"],
    queryFn: fetchDiets,

    staleTime: 60 * 1000, // 1 min
    gcTime: 5 * 60 * 1000, // 5 min
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-muted-foreground">
        Loading diet plans…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-destructive">
        Failed to load diet plans
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-semibold">Diet Plans</h1>
            <p className="text-sm text-muted-foreground">
              View and manage assigned diet plans
            </p>
          </div>
        </div>

        {/* Actions */}
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
      <div className="rounded-lg border bg-card">
        <div className="px-6 py-4 border-b">
          <h4 className="text-sm font-medium">Assigned Diets</h4>
          <p className="text-xs text-muted-foreground">
            Search diets by member name
          </p>
        </div>

        <div className="p-4">
          <DataTable
            columns={DietColumns}
            data={diets}
            searchKey="memberName"
            searchPlaceholder="Search member..."
          />
        </div>
      </div>
    </div>
  );
}
