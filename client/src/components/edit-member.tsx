import { Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import api from "@/axios/axios-api";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "./ui/field";
import { Input } from "./ui/input";
import { useState } from "react";

/* -------------------- SCHEMA -------------------- */
const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  phone: z.string().min(10, "Phone number is required"),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]),
  assignedPackage: z.string().optional(),
});

type UserFormValues = z.infer<typeof updateUserSchema>;

/* -------------------- API -------------------- */
const getMemberById = async (memberId: string) => {
  const res = await api.get(`/user/members/${memberId}`, {
    withCredentials: true,
  });
  return res.data;
};

const updateMember = async ({
  memberId,
  data,
}: {
  memberId: string;
  data: UserFormValues;
}) => {
  if (!data.password) delete data.password;

  const res = await api.put(`/users/members/${memberId}`, data, {
    withCredentials: true,
  });
  return res.data.data.users;
};

const getPackages = async () => {
  const res = await api.get("/packages", { withCredentials: true });
  return res.data.data.packages;
};

/* -------------------- COMPONENT -------------------- */
export default function EditMember({ memberId }: { memberId: string }) {
  const queryClient = useQueryClient();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "active",
      address: {},
    },
  });

  /* Fetch member */
  useQuery({
    queryKey: ["member", memberId],
    queryFn: () => getMemberById(memberId),
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      console.log("user data", data);
      form.reset({
        name: data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        status: data.status ?? "active",
        gender: data.gender ?? undefined,
        assignedPackage: data.assignedPackage ?? "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        address: {
          street: data.address?.street ?? "",
          city: data.address?.city ?? "",
          state: data.address?.state ?? "",
          zipCode: data.address?.zipCode ?? "",
        },
      });
    },
  });

  /* Fetch packages */
  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  /* Update mutation */
  const mutation = useMutation({
    mutationFn: (data: UserFormValues) => updateMember({ memberId, data }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", memberId] });
    },

    onError: (error: any) => {
      const res = error?.response?.data;

      if (res?.field && res?.message) {
        form.setError(res.field as any, {
          type: "server",
          message: res.message,
        });
        return;
      }

      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, message]) => {
          form.setError(field as any, {
            type: "server",
            message: String(message),
          });
        });
      }
    },
  });

  const onSubmit = (data: UserFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Edit className="mr-2 h-4 w-4" />
          Edit Member
        </Button>
      </SheetTrigger>

      <SheetContent>
        {/* ✅ FULL FORM — UNCHANGED UI */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-4 overflow-auto"
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input {...form.register("name")} />
                {form.formState.errors.name && (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.name.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" {...form.register("password")} />
              </Field>

              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.phone.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>Date of Birth</FieldLabel>
                <Input type="date" {...form.register("dateOfBirth")} />
              </Field>

              <Field>
                <FieldLabel>Gender</FieldLabel>
                <select
                  className="border rounded px-3 py-2 w-full"
                  {...form.register("gender")}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <select
                  className="border rounded px-3 py-2 w-full"
                  {...form.register("status")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </Field>

              <Field>
                <FieldLabel>Street</FieldLabel>
                <Input {...form.register("address.street")} />
              </Field>

              <Field>
                <FieldLabel>City</FieldLabel>
                <Input {...form.register("address.city")} />
              </Field>

              <Field>
                <FieldLabel>State</FieldLabel>
                <Input {...form.register("address.state")} />
              </Field>

              <Field>
                <FieldLabel>Zip Code</FieldLabel>
                <Input {...form.register("address.zipCode")} />
              </Field>

              <Field>
                <FieldLabel>Assigned Package</FieldLabel>
                <select
                  className="border rounded px-3 py-2 w-full"
                  {...form.register("assignedPackage")}
                  disabled={packagesLoading}
                >
                  <option value="">
                    {packagesLoading ? "Loading..." : "Select package"}
                  </option>
                  {packages.map((pkg: any) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.packageName}
                    </option>
                  ))}
                </select>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update Member"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
