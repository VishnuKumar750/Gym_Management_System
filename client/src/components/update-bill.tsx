import api from "@/axios/axios-api";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Label } from "./ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { Input } from "./ui/input";
import type { ApiError } from "@/types/api.types";
import SelectStatus from "./select-status";
import SelectPaymentMethod from "./select-payment-method";

/* -------------------- ZOD -------------------- */

const updateFormSchema = z
  .object({
    paymentDate: z.string().min(1, "payment date is required"),
    paymentMethod: z.enum(["cash", "card", "upi", "net-banking", "other"]),
    status: z.enum(["pending", "paid", "overdue", "cancelled"]),
  })
  .partial();

type UpdateFormValue = z.infer<typeof updateFormSchema>;

type UpdateBillPayload = {
  billId: string;
  data: UpdateFormValue;
};

/* -------------------- API -------------------- */

const updateBill = async ({ billId, data }: UpdateBillPayload) => {
  const res = await api.put(`/bills/${billId}/bill`, data, {
    withCredentials: true,
  });
  return res.data;
};

const billStatus = ["pending", "paid", "cancelled", "overdue"] as const;

/* -------------------- COMPONENT -------------------- */

export default function UpdateBill({ billId }: { billId: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateFormValue>({
    paymentDate: "",
    paymentMethod: undefined,
    status: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: updateBill,
    onSuccess: (data) => {
      toast.success(data.message ?? "Bill updated");
      setOpen(false);
      setErrors({});
      setFormData({
        paymentDate: "",
        paymentMethod: undefined,
        status: undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.error ?? "invalid form data");
    },
  });

  const handleSubmit = () => {
    const result = updateFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((e) => {
        fieldErrors[e.path.join(".")] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate({ billId, data: result.data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-full flex items-start justify-start">
        <Button variant="ghost">
          <Edit className="w-4 h-4" />
          Edit bill
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bill</DialogTitle>
          <DialogDescription>edit bill data to update</DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          {/* PAYMENT METHOD */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <SelectPaymentMethod
              value={formData.paymentMethod ?? ""}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  paymentMethod: v as UpdateFormValue["paymentMethod"],
                })
              }
            />
            {errors.paymentMethod && (
              <p className="text-sm text-destructive">{errors.paymentMethod}</p>
            )}
          </div>

          {/* PAYMENT DATE */}
          <div className="space-y-2">
            <Label>Payment Date</Label>
            <Input
              type="date"
              value={formData.paymentDate ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentDate: e.target.value,
                })
              }
            />
            {errors.paymentDate && (
              <p className="text-sm text-destructive">{errors.paymentDate}</p>
            )}
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label>Payment Status</Label>
            <SelectStatus
              value={formData.status ?? ""}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  status: v as UpdateFormValue["status"],
                })
              }
              list={billStatus}
              placeholder="select status"
            />
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">close</Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={mutation.isPending}
            >
              save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
