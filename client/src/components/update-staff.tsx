import { Edit } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

import api from "@/axios/axios-api";
import type { ApiError } from "@/types/api.types";
import z from "zod";

/* ----------------------------- SCHEMA ----------------------------- */

const updateFormSchema = z
  .object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("invalid email"),
    phone: z.string().min(10, "invalid phone number"),
    status: z.enum(["active", "inactive", "suspended"]),
  })
  .partial();

type UpdateFormValue = z.infer<typeof updateFormSchema>;

type StaffStatus = "active" | "inactive" | "suspended";

type IStaff = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: StaffStatus;
  createdAt: string;
};

type Props = {
  staff: IStaff;
};

/* ----------------------------- API ----------------------------- */

const updateStaff = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateFormValue;
}) => {
  const { data } = await api.put(`/user/staff/${id}`, payload, {
    withCredentials: true,
  });
  return data;
};

/* --------------------------- COMPONENT --------------------------- */

export default function UpdateStaff({ staff }: Props) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<UpdateFormValue>({
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    status: staff.status,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateFormValue, string>>
  >({});

  const mutation = useMutation({
    mutationFn: updateStaff,
    onSuccess: (data) => {
      toast.success(data.message ?? "Staff updated");
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error ?? "Update failed");
    },
  });

  const handleChange = (key: keyof UpdateFormValue, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    const result = updateFormSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((e) => {
        const field = e.path[0] as keyof UpdateFormValue;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    mutation.mutate({
      id: staff._id,
      payload: result.data,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Edit className="w-4 h-4 mr-2" />
          Edit Staff
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-medium tracking-tight">
            Update Staff
          </SheetTitle>
          <SheetDescription>Fill the form to update staff</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          {/* Name */}
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              value={form.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              value={form.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input
              value={form.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              value={form.status}
              onValueChange={(val) => handleChange("status", val)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="inactive" id="inactive" />
                <Label htmlFor="inactive">Inactive</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="suspended" id="suspended" />
                <Label htmlFor="suspended">Suspended</Label>
              </div>
            </RadioGroup>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={onSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Submit"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
