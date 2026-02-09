import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Loader2, CirclePlus } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import api from "@/axios/axios-api";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { z } from "zod";
import type { ApiError } from "@/types/api.types";
import SelectPackage from "./select-package";
import SelectMmeber from "./select-member";
import SelectPaymentMethod from "./select-payment-method";
import SelectStatus from "./select-status";

/* ---------------- SCHEMA ---------------- */

const billSchema = z.object({
  memberId: z.string().min(1),
  packageId: z.string().min(1),
  discount: z.number().min(0),
  taxAmount: z.number().min(0),
  paymentDate: z.string().optional(),
  paymentMethod: z
    .enum(["cash", "card", "upi", "netbanking", "other"])
    .optional(),
  status: z.enum(["paid", "pending", "overdue", "cancelled"]),
  remarks: z.string(),
});

type BillFormValues = z.infer<typeof billSchema>;

const billStatus = ["paid", "pending", "overdue", "cancelled"] as const;

const fetchPackages = async () => {
  const { data } = await api.get("/packages", { withCredentials: true });
  return data.data;
};

const createBill = async (data: BillFormValues) => {
  const res = await api.post("/bills/admin", data, { withCredentials: true });
  return res.data;
};

/* ---------------- COMPONENT ---------------- */

export default function BillForm() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<BillFormValues>({
    memberId: "",
    packageId: "",
    discount: 0,
    taxAmount: 0,
    paymentDate: "",
    paymentMethod: undefined,
    status: "pending",
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
  });

  const selectedPackage = packages.find(
    (p: Record<string, string>) => p._id === formData.packageId,
  );
  const amount = selectedPackage?.price ?? 0;

  const taxableAmount = Math.max(amount - formData.discount, 0);
  const taxValue = (taxableAmount * formData.taxAmount) / 100;
  const finalAmount = Math.round((taxableAmount + taxValue) * 100) / 100;

  const mutation = useMutation({
    mutationFn: createBill,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Bill added successfully");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      setFormData({
        memberId: "",
        packageId: "",
        discount: 0,
        taxAmount: 0,
        paymentDate: "",
        paymentMethod: undefined,
        status: "pending",
        remarks: "",
      });
      setErrors({});
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err?.response?.data?.error ?? "Add bill failed");
    },
  });

  const handleSubmit = () => {
    const result = billSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((e) => {
        fieldErrors[e.path.join(".")] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(result.data);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CirclePlus className="w-4 h-4" />
          Add Bill
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Bill</SheetTitle>
          <SheetDescription>fill the form to add bill</SheetDescription>
        </SheetHeader>

        <form className="px-4 space-y-4">
          {/* MEMBER */}
          <div className="space-y-2">
            <Label>Member</Label>
            <SelectMmeber
              value={formData.memberId}
              onChange={(v) => setFormData({ ...formData, memberId: v })}
            />
            {errors.memberId && (
              <p className="text-sm text-red-500">{errors.memberId}</p>
            )}
          </div>

          {/* PACKAGE */}
          <div className="space-y-2">
            <Label>Package</Label>
            <SelectPackage
              value={formData.packageId}
              onChange={(v) => setFormData({ ...formData, packageId: v })}
            />
            {errors.packageId && (
              <p className="text-sm text-red-500">{errors.packageId}</p>
            )}
          </div>

          {/* AMOUNTS */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input readOnly value={amount} className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Discount</Label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Tax %</Label>
              <Input
                type="number"
                value={formData.taxAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxAmount: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Final Amount</Label>
              <Input readOnly value={finalAmount} className="bg-muted" />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="space-y-2">
            <Label>Payment Date</Label>
            <Input
              type="date"
              value={formData.paymentDate}
              onChange={(e) =>
                setFormData({ ...formData, paymentDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <SelectPaymentMethod
              value={formData.paymentMethod}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  paymentMethod: v as BillFormValues["paymentMethod"],
                })
              }
            />
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label>Status</Label>
            <SelectStatus
              value={formData.status}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  status: v as BillFormValues["status"],
                })
              }
              list={billStatus}
              placeholder="select status"
            />
          </div>

          {/* REMARKS */}
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
            />
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            )}
            Save changes
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
