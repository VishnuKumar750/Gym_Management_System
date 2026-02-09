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
import type { MemberDiet } from "@/validators/diet.schema";

interface Props {
  diet: MemberDiet;
}

export default function ViewDiet({ diet }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Eye className="w-4 h-4" />
          View Diet
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{diet?.planName || "Diet Plan"}</SheetTitle>
          <SheetDescription>
            Goal: {diet?.goal?.replace("_", " ")}
          </SheetDescription>
        </SheetHeader>

        {/* Diet Content */}
        {diet && (
          <div className="space-y-6 px-4">
            <section className="space-y-2">
              <h4 className="font-medium">Member</h4>
              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Duration:</span>{" "}
                  {diet.member.name}
                </p>
                <p>
                  <span className="font-medium text-foreground">Status:</span>{" "}
                  {diet.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </section>

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
