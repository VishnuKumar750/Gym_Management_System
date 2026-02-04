import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, Check } from "lucide-react";
import { Button } from "./ui/button";
import api from "@/axios/axios-api";

/* ---------------- Zod Schema ---------------- */

const packageFormSchema = z.object({
  packageName: z.string().min(1, "Package name is required").trim(),
  duration: z.coerce
    .number()
    .min(1, "Duration must be at least 1 month")
    .max(36, "Duration cannot exceed 36 months"),
  price: z.coerce
    .number()
    .min(0, "Price cannot be negative")
    .max(999999, "Price is too high"),
  features: z
    .array(
      z.object({
        value: z.string().min(1, "Feature cannot be empty"),
      }),
    )
    .min(1, "Add at least one feature"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type PackageFormData = z.infer<typeof packageFormSchema>;

/* ---------------- API ---------------- */

const createPackage = async (data: PackageFormData) => {
  const payload = {
    ...data,
    packageName: data.packageName.trim(),
    description: data.description?.trim(),
    features: data.features.map((f) => f.value.trim()),
  };

  const res = await api.post("/packages", payload, {
    withCredentials: true,
  });

  return res.data;
};

/* ---------------- Component ---------------- */

export default function PackageForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      packageName: "",
      duration: 1,
      price: 0,
      features: [{ value: "" }],
      description: "",
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const mutation = useMutation({
    mutationFn: createPackage,
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setIsSuccess(true);
      reset();
    },
    onError: (err) => {
      console.error("Create package failed", err);
    },
  });

  const onSubmit = (data: PackageFormData) => {
    if (mutation.isPending) return;
    mutation.mutate(data);
  };

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => setIsSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  return (
    <div className="min-h-screen p-4 bg-muted overflow-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold mb-1">Create Package</h1>
          <p className="text-muted-foreground text-sm">
            Design a membership plan for your gym
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="mb-6 bg-gray-900 text-white p-4 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">
              Package created successfully
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-2 my-6">
          <div className="space-y-4">
            {/* Package Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Package Name</label>
              <input
                {...register("packageName")}
                aria-invalid={!!errors.packageName}
                className="input-field w-full px-3 py-2 border border-muted-foreground rounded-md"
                placeholder="e.g., Premium Yearly"
              />
              {errors.packageName && (
                <p className="text-red-600 text-xs">
                  {errors.packageName.message}
                </p>
              )}
            </div>

            {/* Duration & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">
                  Duration (Months)
                </label>
                <input
                  {...register("duration", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="input-field w-full px-3 py-2 border border-muted-foreground rounded-md"
                />
                {errors.duration && (
                  <p className="text-red-600 text-xs">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Price</label>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="input-field w-full px-3 py-2 border border-muted-foreground rounded-md"
                />
                {errors.price && (
                  <p className="text-red-600 text-xs">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Features</label>
                <button
                  type="button"
                  onClick={() => append({ value: "" })}
                  className="text-xs font-medium"
                >
                  + Add
                </button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      {...register(`features.${index}.value`)}
                      className="input-field flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder={`Feature ${index + 1}`}
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="px-3 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {errors.features?.[index]?.value && (
                    <p className="text-red-600 text-xs">
                      {errors.features[index]?.value?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="input-field w-full px-3 py-2 border border-muted-foreground rounded-md resize-none"
                placeholder="Describe the package..."
              />
            </div>

            {/* Active */}
            <div className="flex items-center justify-between py-3 border-t">
              <label className="text-sm font-medium">Active</label>
              <input
                {...register("isActive")}
                type="checkbox"
                className="h-4 w-4"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Package"
              )}
            </Button>

            {mutation.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">
                  Failed to create package. Please try again.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
