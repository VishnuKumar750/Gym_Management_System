import { Eye } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import api from "@/axios/axios-api";
import { useQuery } from "@tanstack/react-query";

const getDietById = async (dietId: string) => {
  const { data } = await api.get(`/dietPlan/${dietId}`, {
    withCredentials: true,
  });

  return data.data; // adjust if backend wraps response
};

interface Props {
  dietId: string;
}

export default function ViewDiet({ dietId }: Props) {
  const {
    data: diet,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["diet", dietId],
    queryFn: () => getDietById(dietId),
    enabled: !!dietId,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Eye className="w-4 h-4" />
          View Diet
        </Button>
      </SheetTrigger>

      <SheetContent className="px-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{diet?.planName || "Diet Plan"}</SheetTitle>
          <SheetDescription>
            Goal: {diet?.goal?.replace("_", " ")}
          </SheetDescription>
        </SheetHeader>

        {/* Loading */}
        {isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading diet plan…
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="py-10 text-center text-sm text-destructive">
            {(error as Error)?.message || "Failed to load diet"}
          </div>
        )}

        {/* Diet Content */}
        {diet && (
          <div className="mt-6 space-y-6">
            {/* Overview */}
            <section className="space-y-2">
              <h4 className="font-medium">Overview</h4>
              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Duration:</span>{" "}
                  {new Date(diet.startDate).toLocaleDateString()}{" "}
                  {diet.endDate &&
                    `– ${new Date(diet.endDate).toLocaleDateString()}`}
                </p>
                <p>
                  <span className="font-medium text-foreground">Status:</span>{" "}
                  {diet.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </section>

            {/* Calories */}
            {diet.calories && (
              <section className="space-y-2">
                <h4 className="font-medium">Daily Macros</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>Calories: {diet.calories.daily ?? "--"}</div>
                  <div>Protein: {diet.calories.protein ?? "--"} g</div>
                  <div>Carbs: {diet.calories.carbs ?? "--"} g</div>
                  <div>Fats: {diet.calories.fats ?? "--"} g</div>
                </div>
              </section>
            )}

            {/* Meals */}
            <section className="space-y-4">
              <h4 className="font-medium">Meals</h4>

              {diet.meals.map((meal: any, index: number) => (
                <div key={index} className="rounded-md border p-3 space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="capitalize">{meal.mealType}</span>
                    {meal.time && <span>{meal.time}</span>}
                  </div>

                  <div className="space-y-1 text-sm">
                    {meal.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="flex justify-between">
                        <span>
                          {item.food} ({item.quantity})
                        </span>
                        <span>
                          {item.calories ? `${item.calories} cal` : "--"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Notes */}
            {diet.notes && (
              <section className="space-y-1">
                <h4 className="font-medium">Notes</h4>
                <p className="text-sm text-muted-foreground">{diet.notes}</p>
              </section>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
