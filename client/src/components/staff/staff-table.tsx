import DataTable from "@/components/table";
import type { Staff } from "@/types/staff.types";
import { StaffColumns } from "./staff-columns";

type Props = {
  data: Staff[];
};

export function StaffTable({ data }: Props) {
  return (
    <DataTable
      columns={StaffColumns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search members..."
    />
  );
}
