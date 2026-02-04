import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Loader2, Check, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { FieldSet, Field, FieldLabel } from "./ui/field";
import api from "@/axios/axios-api";

/* ---------------- Zod Schema ---------------- */

const billSchema = z.object({
  member: z.string().min(1, "Member is required"),
  package: z.string().min(1, "Package is required"),

  amount: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  taxAmount: z.coerce.number().min(0).default(0),

  paymentDate: z.coerce.date(),
  paymentMethod: z.enum(["cash", "card", "upi", "netbanking", "other"]),

  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),

  status: z.enum(["paid", "pending", "overdue", "cancelled"]),
  remarks: z.string().optional(),
});

type BillFormValues = z.infer<typeof billSchema>;

/* ---------------- API ---------------- */

// api function
const fetchMembers = async () => {
  const { data } = await api.get("/user/members", {
    withCredentials: true,
  });
  return data.data.users;
};

const fetchPackages = async () => {
  const { data } = await api.get("/packages", {
    withCredentials: true,
  });

  return data.data.packages;
};

const createBill = async (data: BillFormValues) => {
  const res = await api.post("/bills", data, { withCredentials: true });
  return res.data;
};

/* ---------------- Component ---------------- */

export default function BillForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      amount: 0,
      discount: 0,
      taxAmount: 0,
      paymentMethod: "cash",
      status: "paid",
    },
  });

  const mutation = useMutation({
    mutationFn: createBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      setIsSuccess(true);
      reset();
    },
  });

  useEffect(() => {
    if (!isSuccess) return;
    const t = setTimeout(() => setIsSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [isSuccess]);

  const amount = watch("amount") || 0;
  const discount = watch("discount") || 0;
  const taxAmount = watch("taxAmount") || 0;
  const finalAmount = Math.max(amount - discount + taxAmount, 0);

  const onSubmit = (data: BillFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CirclePlus className="w-4 h-4" />
          Add Bill
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Bill</SheetTitle>
        </SheetHeader>

        {isSuccess && (
          <div className="my-4 rounded-md bg-primary text-primary-foreground px-4 py-3 text-sm">
            <Check className="inline w-4 h-4 mr-2" />
            Bill created successfully
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="px-4">
          <FieldSet>
            {/* Member */}
            <Field>
              <FieldLabel>Member</FieldLabel>
              <Select onValueChange={(v) => setValue("member", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m: any) => (
                    <SelectItem key={m._id} value={m._id}>
                      {m.name} ({m.memberId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.member && (
                <p className="text-xs text-destructive">
                  {errors.member.message}
                </p>
              )}
            </Field>

            {/* Package */}
            <Field>
              <FieldLabel>Package</FieldLabel>
              <Select onValueChange={(v) => setValue("package", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((p: any) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.packageName} – ₹{p.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.package && (
                <p className="text-xs text-destructive">
                  {errors.package.message}
                </p>
              )}
            </Field>

            {/* Amounts */}
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Amount</FieldLabel>
                <Input type="number" {...register("amount")} />
              </Field>

              <Field>
                <FieldLabel>Discount</FieldLabel>
                <Input type="number" {...register("discount")} />
              </Field>

              <Field>
                <FieldLabel>Final</FieldLabel>
                <div className="h-10 flex items-center rounded-md border bg-muted px-3 font-medium">
                  ₹{finalAmount.toFixed(2)}
                </div>
              </Field>
            </div>

            {/* Payment */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Payment Date</FieldLabel>
                <Input type="date" {...register("paymentDate")} />
              </Field>

              <Field>
                <FieldLabel>Payment Method</FieldLabel>
                <Select
                  defaultValue="cash"
                  onValueChange={(v) => setValue("paymentMethod", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Validity */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Valid From</FieldLabel>
                <Input type="date" {...register("validFrom")} />
              </Field>

              <Field>
                <FieldLabel>Valid Until</FieldLabel>
                <Input type="date" {...register("validUntil")} />
              </Field>
            </div>

            {/* Status */}
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                defaultValue="paid"
                onValueChange={(v) => setValue("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Remarks */}
            <Field>
              <FieldLabel>Remarks</FieldLabel>
              <Textarea rows={3} {...register("remarks")} />
            </Field>

            {/* Submit */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </span>
              ) : (
                "Create Bill"
              )}
            </Button>
          </FieldSet>
        </form>
      </SheetContent>
    </Sheet>
  );
}
