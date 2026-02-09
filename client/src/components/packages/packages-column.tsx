import type { ColumnDef } from "@tanstack/react-table";
import type { IPackage } from "@/types/package.types";

export const PackageColumns: ColumnDef<IPackage>[] = [
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
