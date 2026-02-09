import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FieldDescription } from "./ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { SelectGender } from "./select-gender";
import SelectPackage from "./select-package";

import {
  memberFormSchema,
  type MemberFormData,
} from "@/validators/user/user.schema";
import { createUser } from "@/api/user/user.api";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/api.types";

/* --------------------------- COMPONENT --------------------------- */

export default function AddMember() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<MemberFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "male",
    assignedPackage: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof MemberFormData, string>>
  >({});

  /* --------------------------- MUTATION --------------------------- */

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      toast.success(data.message ?? "Member created");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        gender: "male",
        assignedPackage: "",
      });
      setErrors({});
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err?.response?.data?.message ?? "Failed to create member");
    },
  });

  /* --------------------------- HANDLERS --------------------------- */

  const handleChange = (key: keyof MemberFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    const result = memberFormSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((e) => {
        const field = e.path[0] as keyof MemberFormData;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    mutation.mutate(result.data);
  };

  /* ----------------------------- UI ------------------------------ */

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Add Member</SheetTitle>
          <SheetDescription>
            Fill the form to create a new member
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <FieldDescription className="text-red-500">
                {errors.name}
              </FieldDescription>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <FieldDescription className="text-red-500">
                {errors.email}
              </FieldDescription>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {errors.password && (
              <FieldDescription className="text-red-500">
                {errors.password}
              </FieldDescription>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <FieldDescription className="text-red-500">
                {errors.phone}
              </FieldDescription>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <SelectGender
              value={form.gender}
              onChange={(val) => handleChange("gender", val)}
            />
            {errors.gender && (
              <FieldDescription className="text-red-500">
                {errors.gender}
              </FieldDescription>
            )}
          </div>

          {/* Package */}
          <div className="space-y-2">
            <Label>Assigned Package</Label>
            <SelectPackage
              value={form.assignedPackage}
              onChange={(val) => handleChange("assignedPackage", val)}
            />
            {errors.assignedPackage && (
              <FieldDescription className="text-red-500">
                {errors.assignedPackage}
              </FieldDescription>
            )}
          </div>

          <Button
            className="w-full my-6"
            onClick={onSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Member"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
