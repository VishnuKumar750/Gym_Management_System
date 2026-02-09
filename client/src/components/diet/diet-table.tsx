import DataTable from "@/components/table";
import type { MemberDiet } from "@/validators/diet.schema";
import { DietColumns } from "./diet-columns";

type Props = {
  data: MemberDiet[];
};

export function DietTable({ data }: Props) {
  return (
    <DataTable
      columns={DietColumns}
      data={data}
      searchKey="memberName"
      searchPlaceholder="Search member..."
    />
  );
}
