import { Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

/* ----------------------------- ZOD ----------------------------- */

const updateSupplementSchema = z.object({
  price: z.number().min(0, "Price must be positive"),
  stockQuantity: z.number().min(0, "Stock must be positive"),
  unit: z.string().min(1),
});

type UpdateSupplementValues = z.infer<typeof updateSupplementSchema>;

/* ----------------------------- API ----------------------------- */

const fetchSupplement = async (id: string) => {
  const { data } = await api.get(`/supplement/${id}`, {
    withCredentials: true,
  });
  return data.data;
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

export default function UpdateSupplement({
  supplementId,
}: {
  supplementId: string;
}) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["supplement", supplementId],
    queryFn: () => fetchSupplement(supplementId),
    enabled: !!supplementId,
  });

  const mutation = useMutation({
    mutationFn: updateSupplement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplements"] });
      queryClient.invalidateQueries({
        queryKey: ["supplement", supplementId],
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateSupplementValues>({
    resolver: zodResolver(updateSupplementSchema),
    values: data
      ? {
          price: data.price,
          stockQuantity: data.stockQuantity,
          unit: data.unit,
        }
      : undefined,
  });

  const onSubmit = (values: UpdateSupplementValues) => {
    mutation.mutate({
      id: supplementId,
      payload: values,
    });
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open && data) {
          reset({
            price: data.price,
            stockQuantity: data.stockQuantity,
            unit: data.unit,
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Supplement</DialogTitle>
            <DialogDescription>
              Update stock and pricing information
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Loading supplement…
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {/* Price */}
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("stockQuantity", {
                    valueAsNumber: true,
                  })}
                />
                {errors.stockQuantity && (
                  <p className="text-sm text-destructive">
                    {errors.stockQuantity.message}
                  </p>
                )}
              </div>

              {/* Unit */}
              <div>
                <Label>Unit</Label>
                <Input {...register("unit")} />
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={mutation.isPending || isLoading}>
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
