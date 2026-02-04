import { CirclePlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/axios/axios-api";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

/* ----------------------------- ZOD ----------------------------- */

const supplementSchema = z.object({
  productName: z.string().min(2, "Product name is required"),
  category: z.enum([
    "protein",
    "pre_workout",
    "post_workout",
    "vitamins",
    "other",
  ]),
  brand: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  stockQuantity: z.number().min(0),
  unit: z.string().default("piece"),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean(),
});

type SupplementFormValues = z.infer<typeof supplementSchema>;

/* ----------------------------- API ----------------------------- */

const createSupplement = async (payload: SupplementFormValues) => {
  const { data } = await api.post("/supplement", payload, {
    withCredentials: true,
  });
  return data.data;
};

/* ----------------------------- COMPONENT ----------------------------- */

export default function AddSupplement() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    setError,
  } = useForm<SupplementFormValues>({
    resolver: zodResolver(supplementSchema),
    defaultValues: {
      category: "protein",
      unit: "piece",
      isAvailable: true,
      stockQuantity: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: createSupplement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplements"] });

      reset({
        productName: "",
        brand: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        category: "protein",
        unit: "piece",
        imageUrl: "",
        isAvailable: true,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;

      if (message) {
        setError("root", {
          type: "server",
          message,
        });
      }
    },
  });

  const onSubmit = (values: SupplementFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="w-4 h-4 mr-2" />
          Add Supplement
        </Button>
      </SheetTrigger>

      <SheetContent className="space-y-6 px-4 overflow-auto">
        <SheetHeader>
          <SheetTitle>Add Supplement</SheetTitle>
          <SheetDescription>Add a supplement to the store</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Product Name */}
          <div>
            <Label>Product Name</Label>
            <Input {...register("productName")} />
            {errors.productName && (
              <p className="text-sm text-destructive">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              defaultValue="protein"
              onValueChange={(v) =>
                setValue("category", v as SupplementFormValues["category"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="protein">Protein</SelectItem>
                <SelectItem value="pre_workout">Pre Workout</SelectItem>
                <SelectItem value="post_workout">Post Workout</SelectItem>
                <SelectItem value="vitamins">Vitamins</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div>
            <Label>Brand</Label>
            <Input {...register("brand")} />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea rows={3} {...register("description")} />
          </div>

          {/* Price */}
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              min={0}
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
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
          </div>

          {/* Image URL */}
          <div>
            <Label>Image URL</Label>
            <Input {...register("imageUrl")} />
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label>Available</Label>
              <p className="text-xs text-muted-foreground">Visible in store</p>
            </div>
            <Switch
              defaultChecked
              onCheckedChange={(v) => setValue("isAvailable", v)}
            />
          </div>

          {/* SERVER ERROR */}
          {errors.root?.message && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Save Supplement
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
