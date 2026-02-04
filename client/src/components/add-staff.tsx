import { CirclePlus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { z } from "zod";
import api from "@/axios/axios-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "./ui/field";
import { Input } from "./ui/input";

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number is required"),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const createUser = async (data: UserFormValues) => {
  const res = await api.post("/user/staffs", data);
  return res.data;
};

export default function AddStaff() {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      status: "active",
    },
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = (values: UserFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"}>
          <CirclePlus className="w-4 h-4" /> Add Staff
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Staff</SheetTitle>
        </SheetHeader>

        {/* react hook form with validation for adding member*/}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-4 overflow-auto "
        >
          <FieldSet>
            <FieldGroup>
              {/* Name */}
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="Full name"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.name.message}
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
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.email.message}
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
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  placeholder="Phone number"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.phone.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Date of Birth */}
              <Field>
                <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...form.register("dateOfBirth")}
                />
                {form.formState.errors.dateOfBirth && (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.dateOfBirth.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Gender */}
              <Field>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <select
                  id="gender"
                  className="border rounded px-3 py-2 w-full"
                  {...form.register("gender")}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {form.formState.errors.gender && (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.gender.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Status */}
              <Field>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <select
                  id="status"
                  className="border rounded px-3 py-2 w-full"
                  {...form.register("status")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </Field>

              {/* Address - Street */}
              <Field>
                <FieldLabel>Street</FieldLabel>
                <Input {...form.register("address.street")} />
              </Field>

              {/* Address - City */}
              <Field>
                <FieldLabel>City</FieldLabel>
                <Input {...form.register("address.city")} />
              </Field>

              {/* Address - State */}
              <Field>
                <FieldLabel>State</FieldLabel>
                <Input {...form.register("address.state")} />
              </Field>

              {/* Address - Zip Code */}
              <Field>
                <FieldLabel>Zip Code</FieldLabel>
                <Input {...form.register("address.zipCode")} />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Staff"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
