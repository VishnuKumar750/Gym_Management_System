import DataTable from "@/components/table";
import { NotificationColumns } from "./notification-columns";
import type { INotification } from "@/types/notification.types";

type Props = {
  data: INotification[];
};

export function NotificationsTable({ data }: Props) {
  return (
    <DataTable
      columns={NotificationColumns}
      data={data}
      searchKey="title"
      searchPlaceholder="Search notifications..."
    />
  );
}
