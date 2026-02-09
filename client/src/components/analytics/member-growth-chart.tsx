import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: { month: string; members: number }[];
};

export function MemberGrowthChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="members" fill="#475569" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
