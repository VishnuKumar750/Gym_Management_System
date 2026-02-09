import { CirclePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/api.types";
import { toast } from "sonner";

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
  brand: z.string().min(2, "brand name is required"),
  description: z.string().min(2, "description is required"),
  price: z.number().min(0, "Price must be positive"),
  stockQuantity: z.number().min(0, "stock quantity must be greater than 0"),
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
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<SupplementFormValues>({
    productName: "",
    category: "protein",
    brand: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    unit: "piece",
    imageUrl: "",
    isAvailable: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: createSupplement,
    onSuccess: (data) => {
      toast.success(data?.message ?? "product added");
      queryClient.invalidateQueries({ queryKey: ["supplements"] });
      setFormData({
        productName: "",
        category: "protein",
        brand: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        unit: "piece",
        imageUrl: "",
        isAvailable: true,
      });
      setErrors({});
      setOpen(false);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.error;
      toast.error(message ?? "product creation failed");
    },
  });

  const handleSubmit = () => {
    const result = supplementSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((e) => {
        fieldErrors[e.path.join(".")] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(result.data);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="w-4 h-4 mr-2" />
          Add Supplement
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Add Supplement</SheetTitle>
          <SheetDescription>Add a supplement to the store</SheetDescription>
        </SheetHeader>

        <form className="space-y-4 px-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              placeholder="whey protein powder"
            />
            {errors.productName && (
              <p className="text-sm text-destructive">{errors.productName}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  category: v as SupplementFormValues["category"],
                })
              }
            >
              <SelectTrigger className="w-full">
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
          <div className="space-y-2">
            <Label>Brand</Label>
            <Input
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              placeholder="muscel blaze"
            />
            {errors.brand && (
              <p className="text-sm text-destructive">{errors.brand}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="resize-none "
              placeholder="description of the product"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* unit */}
          <div className="space-y-2">
            <Label>Unit</Label>
            <Select
              value={formData.unit}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  unit: v as SupplementFormValues["unit"],
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
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Price</Label>
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

          {/* Image URL */}
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="link of product image"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label>Available</Label>
              <p className="text-xs text-muted-foreground">Visible in store</p>
            </div>
            <Switch
              checked={formData.isAvailable}
              onCheckedChange={(v) =>
                setFormData({ ...formData, isAvailable: v })
              }
            />
          </div>

          {/* SERVER ERROR */}
          {errors.root && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.root}
            </div>
          )}

          <Button
            type="button"
            className="w-full mb-4"
            onClick={handleSubmit}
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
