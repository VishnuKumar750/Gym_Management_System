import { Edit, IndianRupee, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/axios/axios-api";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

/* ----------------------------- ZOD ----------------------------- */

const updateSupplementSchema = z.object({
  price: z.number().min(0, "Price must be positive"),
  stockQuantity: z.number().min(0, "Stock must be positive"),
  unit: z.string().min(1, "Unit is required"),
});

type UpdateSupplementValues = z.infer<typeof updateSupplementSchema>;

interface ISupplment {
  _id: string;
  price: number;
  stockQuantity: number;
  unit: string;
}

type SupplementData = {
  supplementData: ISupplment;
};

const updateSupplement = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateSupplementValues;
}) => {
  const { data } = await api.put(`/supplement/${id}`, payload, {
    withCredentials: true,
  });
  return data;
};

/* ----------------------------- COMPONENT ----------------------------- */

export default function UpdateSupplement({ supplementData }: SupplementData) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateSupplementValues>({
    price: supplementData.price ?? 0,
    stockQuantity: supplementData.stockQuantity ?? 0,
    unit: supplementData.unit ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: updateSupplement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplements"] });
      queryClient.invalidateQueries({
        queryKey: ["supplement", supplementData._id],
      });
    },
  });

  const handleSubmit = () => {
    const result = updateSupplementSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((e) => {
        fieldErrors[e.path.join(".")] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate({
      id: supplementData._id,
      payload: result.data,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Supplement</DialogTitle>
          <DialogDescription>
            Update stock and pricing information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Price */}
          <div className="space-y-2">
            <Label>
              Price <IndianRupee className="w-4 h-4 text-muted-foreground" />
            </Label>
            <Input
              type="number"
              min={0}
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number(e.target.value),
                })
              }
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label>Stock Quantity</Label>
            <Input
              type="number"
              min={0}
              value={formData.stockQuantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stockQuantity: Number(e.target.value),
                })
              }
            />
            {errors.stockQuantity && (
              <p className="text-sm text-destructive">{errors.stockQuantity}</p>
            )}
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label>Unit</Label>
            <Select
              value={formData.unit}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  unit: v,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="select unit for product" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>select unit for product</SelectLabel>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.unit && (
              <p className="text-sm text-destructive">{errors.unit}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
