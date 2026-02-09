import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, LucidePlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  packageFormSchema,
  type PackageFormValues,
} from "@/validators/feepackage.schema";
import { postPackges } from "@/api/feePackage/fee-package.api";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/api.types";
import { toast } from "sonner";
import React from "react";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function AddPackageForm() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = React.useState<PackageFormValues>({
    packageName: "",
    duration: 1,
    price: 0,
    features: [{ value: "" }],
    isActive: true,
    description: "",
  });

  const [open, setOpen] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: postPackges,
    retry: 1,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Package added");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setErrors({});
      setFormData({
        packageName: "",
        duration: 1,
        price: 0,
        features: [{ value: "" }],
        isActive: true,
        description: "",
      });
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.error ?? "Package creation failed");
      console.error("Create package failed", err);
    },
  });

  const handleSubmit = () => {
    const result = packageFormSchema.safeParse(formData);

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
        <Button variant="outline" className="gap-2">
          <LucidePlusCircle className="w-4 h-4" />
          Add Package
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Package</SheetTitle>
          <SheetDescription>fill the form</SheetDescription>
        </SheetHeader>
        <form className="px-2 my-6">
          <div className="space-y-4">
            {/* Package Name */}
            <div className="space-y-1.5">
              <Label>Package Name</Label>
              <Input
                value={formData.packageName}
                onChange={(e) =>
                  setFormData({ ...formData, packageName: e.target.value })
                }
              />
              {errors.packageName && (
                <p className="text-red-600 text-xs">{errors.packageName}</p>
              )}
            </div>

            {/* Duration & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (Months)</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: Number(e.target.value),
                    })
                  }
                />
                {errors.duration && (
                  <p className="text-red-600 text-xs">{errors.duration}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Price</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number(e.target.value),
                    })
                  }
                />
                {errors.price && (
                  <p className="text-red-600 text-xs">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Features</Label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      features: [...formData.features, { value: "" }],
                    })
                  }
                  className="text-xs"
                >
                  + Add
                </button>
              </div>

              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature.value}
                    onChange={(e) => {
                      const updated = [...formData.features];
                      updated[index].value = e.target.value;
                      setFormData({ ...formData, features: updated });
                    }}
                    placeholder="add features"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          features: formData.features.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                      className="text-gray-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {errors.features && (
                <p className="text-red-600 text-xs">{errors.features}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Active */}
            <div className="flex items-center justify-between border-t py-3">
              <label className="text-sm font-medium">Active</label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>

            {/* Submit */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating…
                </span>
              ) : (
                "Create Package"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
