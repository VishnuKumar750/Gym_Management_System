import SupplementCard from "@/components/supplement-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, ChartSpline, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";
import TypeaheadSearch from "@/components/search-component";
import AddSupplement from "@/components/add-supplement";

/* ----------------------------- TYPES ----------------------------- */

type ISupplement = {
  _id: string;
  imageUrl?: string;
  productName: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  stockQuantity: number;
  unit: string;
  updatedAt: string;
};

type SupplementResponse = {
  data: ISupplement[];
  total: number;
  page: number;
  limit: number;
};

/* ----------------------------- API ----------------------------- */

const fetchSupplements = async ({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search: string;
  status: "" | "true" | "false";
}): Promise<SupplementResponse> => {
  const { data } = await api.get("/supplement", {
    withCredentials: true,
    params: {
      page,
      limit,
      search,
      isAvailable: status,
    },
  });

  return data;
};

/* ----------------------------- SKELETON ----------------------------- */

function SupplementSkeleton() {
  return (
    <div className="w-64 rounded-lg border p-4 space-y-3">
      <Skeleton className="h-32 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

/* ----------------------------- COMPONENT ----------------------------- */

export default function Supplement() {
  const [status, setStatus] = useState<"" | "true" | "false">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 6;

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["supplements", page, search, status],
    queryFn: () =>
      fetchSupplements({
        page,
        limit,
        search,
        status,
      }),
    keepPreviousData: true,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const supplements = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  if (isError) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-destructive">
        Failed to load supplements
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {/* Search */}
        <div className="w-full max-w-md space-y-1">
          <h4 className="text-xs font-medium text-muted-foreground">
            Search supplements
          </h4>

          <TypeaheadSearch
            placeholder="Search by name, brand or category"
            onSearch={(value) => {
              setPage(1);
              setSearch(value);
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
          </Button>

          <AddSupplement />
        </div>
      </div>

      {/* List Header + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold tracking-tight">Supplements</h4>
          <p className="text-xs text-muted-foreground">
            Manage availability and stock
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Sort
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ChartSpline className="mr-2 h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Product status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={(v) => {
                  setPage(1);
                  setStatus(v as "" | "true" | "false");
                }}
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="true">
                  Available
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="false">
                  Not available
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading || isFetching ? (
          Array.from({ length: limit }).map((_, i) => (
            <SupplementSkeleton key={i} />
          ))
        ) : supplements.length > 0 ? (
          supplements.map((supplement) => (
            <SupplementCard key={supplement._id} data={supplement} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground">
            No supplements found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
