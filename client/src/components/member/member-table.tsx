import DataTable from "@/components/table";
import type { Member } from "@/types/member.types";
import { MemberColumns } from "./member-columns";

type Props = {
  data: Member[];
};

export function MembersTable({ data }: Props) {
  return (
    <DataTable
      columns={MemberColumns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search members..."
    />
  );
}
