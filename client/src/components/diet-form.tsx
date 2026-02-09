import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UtensilsCrossed } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import React from "react";
import { createDietPlan } from "@/api/diet/diet.api";
import {
  dietPlanFormSchema,
  type dietPlanFormData,
} from "@/validators/diet.schema";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import type { ApiError } from "@/types/api.types";

type memberId = {
  id: string;
};

export default function DietPlanForm({ id }: memberId) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = React.useState<dietPlanFormData>({
    planName: "",
    goal: "weight_loss",
    startDate: "",
    endDate: "",
    notes: "",
    isActive: true,
    calories: {
      daily: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    },
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (data: dietPlanFormData) => createDietPlan({ id, data }),

    onSuccess: (data) => {
      toast.success(data?.message ?? "diet added successful");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["diet-plans", id] });
      setErrors({});
      setFormData({
        planName: "",
        goal: "weight_loss",
        startDate: "",
        endDate: "",
        notes: "",
        isActive: true,
        calories: { daily: 0, protein: 0, carbs: 0, fats: 0 },
      });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err?.response?.data?.error ?? "invalid diet data");
    },
  });

  const handleSubmit = () => {
    const result = dietPlanFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error?.issues.forEach((e) => {
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
        <Button variant="ghost" className="w-full justify-start">
          <UtensilsCrossed className="w-4 h-4" />
          Add Diet
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Create Diet Plan</SheetTitle>
          <SheetDescription>
            Design a personalized nutrition plan for members
          </SheetDescription>
        </SheetHeader>

        <form className="px-4 space-y-6">
          {/* PLAN NAME */}
          <div className="space-y-2">
            <Label>Plan Name</Label>
            <Input
              value={formData.planName}
              onChange={(e) =>
                setFormData({ ...formData, planName: e.target.value })
              }
            />
            {errors.planName && (
              <p className="text-destructive text-xs">{errors.planName}</p>
            )}
          </div>

          {/* GOAL */}
          <div className="space-y-2">
            <Label>Goal</Label>
            <select
              value={formData.goal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  goal: e.target.value as dietPlanFormData["goal"],
                })
              }
              className="h-10 w-full rounded-md border px-3 text-sm"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="athletic_performance">Athletic Performance</option>
            </select>
          </div>

          {/* MACROS */}
          <div className="grid grid-cols-2 gap-2">
            {(["daily", "protein", "carbs", "fats"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <Label>{key}</Label>
                <Input
                  type="number"
                  value={formData.calories[key]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calories: {
                        ...formData.calories,
                        [key]: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>

          {/* DATES */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>

          {/* NOTES */}
          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          {/* STATUS */}
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
            />
          </div>

          {/* SUBMIT */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Creating..." : "Create Diet Plan"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
