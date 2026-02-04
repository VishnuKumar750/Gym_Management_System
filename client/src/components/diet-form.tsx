import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, UtensilsCrossed } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import api from "@/axios/axios-api";

// Zod Schema
const mealItemSchema = z.object({
  food: z.string().min(1, "Food item is required"),
  quantity: z.string().min(1, "Quantity is required"),
  calories: z.coerce.number().min(0, "Calories must be positive"),
});

const mealSchema = z.object({
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  time: z.string().min(1, "Time is required"),
  items: z.array(mealItemSchema).min(1, "Add at least one food item"),
});

const dietPlanFormSchema = z.object({
  planName: z.string().min(1, "Plan name is required").trim(),
  goal: z.enum([
    "weight_loss",
    "muscle_gain",
    "maintenance",
    "athletic_performance",
  ]),
  calories: z
    .object({
      daily: z.coerce.number().min(0).optional(),
      protein: z.coerce.number().min(0).optional(),
      carbs: z.coerce.number().min(0).optional(),
      fats: z.coerce.number().min(0).optional(),
    })
    .optional(),
  meals: z.array(mealSchema).min(1, "Add at least one meal"),
  notes: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

type DietPlanFormData = z.infer<typeof dietPlanFormSchema>;

const createDietPlan = async ({
  memberId,
  data,
}: {
  memberId: string;
  data: DietPlanFormData;
}) => {
  const res = await api.post(
    "/dietPlan",
    {
      ...data,
      member: memberId, // 👈 injected here
    },
    { withCredentials: true },
  );

  return res.data;
};

export default function DietPlanForm({ memberId }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: DietPlanFormData) =>
      createDietPlan({
        memberId,
        data,
      }),

    onSuccess: () => {
      // ✅ refetch only this member’s diet plans
      queryClient.invalidateQueries({
        queryKey: ["diet-plans", memberId],
      });

      reset();
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DietPlanFormData>({
    resolver: zodResolver(dietPlanFormSchema),
    defaultValues: {
      planName: "",
      goal: "maintenance",
      calories: {
        daily: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      },
      meals: [
        {
          mealType: "breakfast",
          time: "",
          items: [{ food: "", quantity: "", calories: 0 }],
        },
      ],
      notes: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isActive: true,
    },
  });

  const {
    fields: mealFields,
    append: appendMeal,
    remove: removeMeal,
  } = useFieldArray({
    control,
    name: "meals",
  });

  const onSubmit = (data: DietPlanFormData) => {
    mutation.mutate(data);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start">
          <UtensilsCrossed className="w-4 h-4" />
          Add Diet
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Diet Plan</SheetTitle>
          <SheetDescription>
            Design a personalized nutrition plan for members
          </SheetDescription>
        </SheetHeader>
        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-4 py-2 space-y-6 overflow-y-auto"
        >
          {/* BASIC INFO */}
          <FieldSet>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field className="md:col-span-2">
                <FieldLabel>Plan Name</FieldLabel>
                <Input
                  {...register("planName")}
                  placeholder="e.g., Muscle Building Plan"
                />
                {errors.planName && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.planName.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel>Goal</FieldLabel>
                <select
                  {...register("goal")}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="athletic_performance">
                    Athletic Performance
                  </option>
                </select>
                {errors.goal && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.goal.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* MACROS */}
          <FieldSet>
            <FieldGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Field>
                <FieldLabel>Calories</FieldLabel>
                <Input
                  type="number"
                  {...register("calories.daily")}
                  placeholder="2000"
                />
              </Field>

              <Field>
                <FieldLabel>Protein (g)</FieldLabel>
                <Input
                  type="number"
                  {...register("calories.protein")}
                  placeholder="150"
                />
              </Field>

              <Field>
                <FieldLabel>Carbs (g)</FieldLabel>
                <Input
                  type="number"
                  {...register("calories.carbs")}
                  placeholder="200"
                />
              </Field>

              <Field>
                <FieldLabel>Fats (g)</FieldLabel>
                <Input
                  type="number"
                  {...register("calories.fats")}
                  placeholder="60"
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* MEALS */}
          <FieldSet>
            <div className="flex items-center justify-between mb-3">
              <FieldLabel>Meals</FieldLabel>
              <button
                type="button"
                onClick={() =>
                  appendMeal({
                    mealType: "snack",
                    time: "",
                    items: [{ food: "", quantity: "", calories: 0 }],
                  })
                }
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                + Add Meal
              </button>
            </div>

            <div className="space-y-4">
              {mealFields.map((field, mealIndex) => (
                <MealSection
                  key={field.id}
                  mealIndex={mealIndex}
                  register={register}
                  control={control}
                  errors={errors}
                  removeMeal={removeMeal}
                  showRemove={mealFields.length > 1}
                />
              ))}
            </div>

            {errors.meals && (
              <p className="text-destructive text-xs mt-2">
                {errors.meals.message}
              </p>
            )}
          </FieldSet>

          {/* DATES */}
          <FieldSet>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Start Date</FieldLabel>
                <Input type="date" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel>End Date (Optional)</FieldLabel>
                <Input type="date" {...register("endDate")} />
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* NOTES */}
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Notes</FieldLabel>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  placeholder="Any additional instructions or notes..."
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* STATUS */}
          <FieldSet>
            <FieldGroup>
              <Field className="flex items-center justify-between">
                <FieldLabel>Active</FieldLabel>
                <input
                  {...register("isActive")}
                  type="checkbox"
                  className="h-4 w-4"
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2.5"
          >
            {mutation.isPending ? "Creating..." : "Create Diet Plan"}
          </Button>

          {mutation.isError && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3">
              <p className="text-destructive text-sm">
                Failed to create diet plan. Please try again.
              </p>
            </div>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}

// Meal Section Component
function MealSection({
  mealIndex,
  register,
  control,
  removeMeal,
  showRemove,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `meals.${mealIndex}.items`,
  });

  return (
    <div className="p-4 border border-border rounded-lg space-y-3 bg-card">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 gap-3 flex-1">
          <select
            {...register(`meals.${mealIndex}.mealType`)}
            className="px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <input
            {...register(`meals.${mealIndex}.time`)}
            type="time"
            className="px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground"
          />
        </div>
        {showRemove && (
          <button
            type="button"
            onClick={() => removeMeal(mealIndex)}
            className="p-2 text-destructive hover:bg-destructive/10 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Food Items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Food Items
          </label>
          <button
            type="button"
            onClick={() => append({ food: "", quantity: "", calories: 0 })}
            className="text-xs text-foreground hover:text-muted-foreground"
          >
            + Add Item
          </button>
        </div>

        {fields.map((item, itemIndex) => (
          <div key={item.id} className="grid grid-cols-12 gap-2">
            <input
              {...register(`meals.${mealIndex}.items.${itemIndex}.food`)}
              className="col-span-5 px-2 py-1.5 bg-background border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
              placeholder="Food"
            />
            <input
              {...register(`meals.${mealIndex}.items.${itemIndex}.quantity`)}
              className="col-span-3 px-2 py-1.5 bg-background border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
              placeholder="Qty"
            />
            <input
              {...register(`meals.${mealIndex}.items.${itemIndex}.calories`)}
              type="number"
              className="col-span-3 px-2 py-1.5 bg-background border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
              placeholder="Cal"
            />
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(itemIndex)}
                className="col-span-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
