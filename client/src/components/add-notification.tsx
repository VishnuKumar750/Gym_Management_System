import { BellPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/axios/axios-api";

/* ----------------------------- ZOD SCHEMA ----------------------------- */

const notificationSchema = z.object({
  title: z.string().min(3, "Title is required"),
  message: z.string().min(5, "Message is required"),
  type: z.enum([
    "payment_due",
    "payment_received",
    "general",
    "holiday",
    "event",
    "urgent",
  ]),
  recipient: z.string().min(1, "Member is required"),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

/* ----------------------------- API CALLS ------------------------------ */

type Member = {
  _id: string;
  name: string;
  memberId: string;
};

const fetchMembers = async (): Promise<Member[]> => {
  const { data } = await api.get("/user/members?status=active");
  return data.data;
};

const createNotification = async (payload: NotificationFormValues) => {
  const { data } = await api.post("/notification", payload);
  return data;
};

/* ------------------------------ COMPONENT ----------------------------- */

export default function AddNotification() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [form, setForm] = useState<NotificationFormValues>({
    title: "",
    message: "",
    type: "general",
    recipient: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof NotificationFormValues, string>>
  >({});

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const mutation = useMutation({
    mutationFn: createNotification,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Notification created");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setForm({
        title: "",
        message: "",
        type: "general",
        recipient: "",
      });
      setErrors({});
      setOpen(false);
    },
  });

  const handleChange = (key: keyof NotificationFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    const result = notificationSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((e) => {
        const field = e.path[0] as keyof NotificationFormValues;
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
          <BellPlus className="w-4 h-4 mr-2" />
          Add Notification
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Add Notification</SheetTitle>
          <SheetDescription>Send notification to a member</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              rows={4}
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => handleChange("type", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="payment_due">Payment Due</SelectItem>
                <SelectItem value="payment_received">
                  Payment Received
                </SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Member */}
          <div className="space-y-2">
            <Label>Member</Label>
            <Select
              value={form.recipient}
              onValueChange={(v) => handleChange("recipient", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m._id} value={m._id}>
                    {m.name} – {m.memberId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.recipient && (
              <p className="text-sm text-destructive">{errors.recipient}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            onClick={onSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Send Notification
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
