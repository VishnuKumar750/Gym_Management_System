import DataTable from "@/components/table";
import type { IPackage } from "@/types/package.types";
import { PackageColumns } from "./packages-column";

type Props = {
  data: IPackage[];
};

export function PackagesTable({ data }: Props) {
  return (
    <DataTable
      columns={PackageColumns}
      data={data}
      searchKey="packageName"
      searchPlaceholder="Search packages..."
    />
  );
}
