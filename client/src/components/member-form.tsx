import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Loader2, Check, UserPlus } from "lucide-react";
import { useState } from "react";

// Zod Schema
const memberFormSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
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
  emergencyContact: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      relationship: z.string().optional(),
    })
    .optional(),
  joiningDate: z.string().min(1, "Joining date is required"),
  status: z.enum(["active", "inactive", "suspended"]),
  assignedPackage: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberFormSchema>;

// API Functions
const fetchPackages = async () => {
  const response = await fetch("/api/packages");
  if (!response.ok) throw new Error("Failed to fetch packages");
  return response.json();
};

const createMember = async (data: MemberFormData) => {
  const response = await fetch("/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create member");
  return response.json();
};

export default function MemberForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const queryClient = useQueryClient();

  // Fetch packages
  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
      dateOfBirth: "",
      gender: undefined,
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
      joiningDate: new Date().toISOString().split("T")[0],
      status: "active",
      assignedPackage: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 3000);
    },
  });

  const onSubmit = (data: MemberFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Add New Member
              </h1>
              <p className="text-sm text-muted-foreground">
                Register a new gym member with their details
              </p>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="mb-6 bg-primary text-primary-foreground p-4 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">
              Member registered successfully
            </span>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-destructive text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="+1234567890"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-xs">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Date of Birth
                  </label>
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Gender
                  </label>
                  <select
                    {...register("gender")}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Joining Date
                  </label>
                  <input
                    {...register("joiningDate")}
                    type="date"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  />
                  {errors.joiningDate && (
                    <p className="text-destructive text-xs">
                      {errors.joiningDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
                Address
              </h3>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Street
                </label>
                <input
                  {...register("address.street")}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    City
                  </label>
                  <input
                    {...register("address.city")}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="New York"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    State
                  </label>
                  <input
                    {...register("address.state")}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="NY"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Zip Code
                  </label>
                  <input
                    {...register("address.zipCode")}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
                Emergency Contact
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    {...register("emergencyContact.name")}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <input
                    {...register("emergencyContact.phone")}
                    type="tel"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Relationship
                  </label>
                  <input
                    {...register("emergencyContact.relationship")}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Spouse, Parent, etc."
                  />
                </div>
              </div>
            </div>

            {/* Membership Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
                Membership Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Assigned Package
                  </label>
                  <select
                    {...register("assignedPackage")}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  >
                    <option value="">Select package</option>
                    {packages.map((pkg: any) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.packageName} - ${pkg.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  {errors.status && (
                    <p className="text-destructive text-xs">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-primary text-primary-foreground font-medium py-2.5 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Member...
                </span>
              ) : (
                "Create Member"
              )}
            </button>

            {mutation.isError && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-destructive text-sm">
                  Failed to create member. Please try again.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
