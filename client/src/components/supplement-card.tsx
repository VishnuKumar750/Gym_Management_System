import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UpdateSupplement from "./update-supplement";
import DeleteSupplement from "./delete-supplement";
import type { SupplementCardProps } from "@/types/supplement.types";

export default function SupplementCard({ data }: SupplementCardProps) {
  return (
    <Card className="w-full md:w-xs overflow-hidden relative">
      <CardHeader className="p-0">
        <img
          src={data?.imageUrl ?? ""}
          alt={data.productName}
          className="h-48 w-full object-cover"
        />
      </CardHeader>

      <CardContent className="space-y-2 pt-4">
        <CardTitle className="text-lg font-semibold">
          {data.productName}
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          {data.brand} • {data.category}
        </p>

        <p className="text-sm line-clamp-2">{data.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-base font-medium">
            ₹{data.price} / {data.unit}
          </span>

          <Badge variant={data.isAvailable ? "default" : "destructive"}>
            {data.isAvailable ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardContent>
      <div className="absolute top-5 right-10 flex gap-4">
        <UpdateSupplement supplementData={data} />
        <DeleteSupplement supplementId={data._id} />
      </div>
    </Card>
  );
}
