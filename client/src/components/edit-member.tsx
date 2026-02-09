import { Edit } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import api from "@/axios/axios-api";
import type { ApiError } from "@/types/api.types";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

/* ----------------------------- SCHEMA ----------------------------- */

const updateUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone is required"),
    status: z.enum(["active", "inactive", "suspended"]),
  })
  .partial();

type UserFormValues = z.infer<typeof updateUserSchema>;
type MemberStatus = "active" | "inactive" | "suspended";

type Props = {
  memberData: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status?: MemberStatus;
  };
};

/* ----------------------------- API ----------------------------- */

const updateMember = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<UserFormValues>;
}) => {
  const res = await api.put(`/user/members/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

/* --------------------------- COMPONENT --------------------------- */

export default function EditMemberSimple({ memberData }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<UserFormValues>({
    name: memberData.name ?? "",
    email: memberData.email ?? "",
    phone: memberData.phone ?? "",
    status: memberData.status ?? "active",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormValues, string>>
  >({});

  const mutation = useMutation({
    mutationFn: updateMember,
    onSuccess: (data) => {
      toast.success(data.message ?? "Member updated");
      setErrors({});
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({
        queryKey: ["member", memberData._id],
      });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err?.response?.data?.error ?? "Update failed");
    },
  });

  const handleChange = (key: keyof UserFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    const result = updateUserSchema.safeParse(form);

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
    mutation.mutate({
      id: memberData._id,
      data: result.data,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Member
        </Button>
      </SheetTrigger>

      <SheetContent className="p-0">
        <div className="max-w-md space-y-4 p-4">
          <h2 className="text-lg font-semibold">Edit Member</h2>

          {/* Name */}
          <div>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Name"
              value={form.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Email"
              value={form.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Phone"
              value={form.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Status */}
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <Button
            className="w-full py-2 font-medium tracking-tight"
            onClick={onSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update Member"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
