import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { z } from "zod";

import api from "@/axios/axios-api";
import type { ApiError } from "@/types/api.types";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "./ui/field";
import { Input } from "./ui/input";

/* ----------------------------- ZOD SCHEMA ----------------------------- */

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number is required"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

/* ----------------------------- API ----------------------------- */

const createUser = async (payload: UserFormValues) => {
  const { data } = await api.post("/user/staff", payload, {
    withCredentials: true,
  });
  return data;
};

/* --------------------------- COMPONENT --------------------------- */

export default function AddStaff() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<UserFormValues>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormValues, string>>
  >({});

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Staff created");
      setForm({ name: "", email: "", password: "", phone: "" });
      setErrors({});
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err?.response?.data?.error ?? "Create staff failed");
    },
  });

  const handleChange = (key: keyof UserFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    const result = userFormSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((e) => {
        const field = e.path[0] as keyof UserFormValues;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    mutation.mutate(result.data);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Staff</SheetTitle>
        </SheetHeader>

        <div className="p-4 overflow-auto">
          <FieldSet>
            <FieldGroup>
              {/* Name */}
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && (
                  <FieldDescription className="text-red-500">
                    {errors.name}
                  </FieldDescription>
                )}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {errors.email && (
                  <FieldDescription className="text-red-500">
                    {errors.email}
                  </FieldDescription>
                )}
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password}
                  </FieldDescription>
                )}
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                {errors.phone && (
                  <FieldDescription className="text-red-500">
                    {errors.phone}
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            className="w-full mt-6"
            onClick={onSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Staff"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
