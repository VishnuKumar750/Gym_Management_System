"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellPlus, Loader2 } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/axios/axios-api";

/* ----------------------------- ZOD SCHEMA ----------------------------- */

const notificationSchema = z
  .object({
    title: z.string().min(3),
    message: z.string().min(5),
    type: z.enum([
      "payment_due",
      "payment_received",
      "general",
      "holiday",
      "event",
      "urgent",
    ]),
    targetAudience: z.enum(["all", "active_members", "specific"]),
    recipients: z.array(z.string()).optional(),
    scheduledDate: z.date().optional(),
  })
  .refine(
    (data) =>
      data.targetAudience !== "specific" ||
      (data.recipients && data.recipients.length > 0),
    {
      message: "Select at least one member",
      path: ["recipients"],
    },
  );

type NotificationFormValues = z.infer<typeof notificationSchema>;

/* ----------------------------- API CALLS ------------------------------ */

const fetchMembers = async () => {
  const { data } = await api.get("/user/members?status=active");
  return data.data.users; // [{ _id, name }]
};

const createNotification = async (payload: any) => {
  const { data } = await api.post("/notification", payload);
  console.log(data);
  return data;
};

/* ------------------------------ COMPONENT ----------------------------- */

export default function AddNotification() {
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const mutation = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "general",
      targetAudience: "all",
      recipients: [],
    },
  });

  const targetAudience = watch("targetAudience");
  const recipients = watch("recipients") || [];

  const toggleRecipient = (id: string) => {
    setValue(
      "recipients",
      recipients.includes(id)
        ? recipients.filter((r) => r !== id)
        : [...recipients, id],
    );
  };

  const onSubmit = (values: NotificationFormValues) => {
    mutation.mutate({
      ...values,
      scheduledDate: values.scheduledDate
        ? values.scheduledDate.toISOString()
        : null,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <BellPlus className="w-4 h-4 mr-2" />
          Add Notification
        </Button>
      </SheetTrigger>

      <SheetContent className="space-y-6 px-4 overflow-auto">
        <SheetHeader>
          <SheetTitle>Add Notification</SheetTitle>
          <SheetDescription>Send notifications to gym members</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label>Message</Label>
            <Textarea rows={4} {...register("message")} />
            {errors.message && (
              <p className="text-sm text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <Label>Type</Label>
            <Select
              defaultValue="general"
              onValueChange={(v) => setValue("type", v as any)}
            >
              <SelectTrigger>
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

          {/* Audience */}
          <div>
            <Label>Target Audience</Label>
            <Select
              defaultValue="all"
              onValueChange={(v) => setValue("targetAudience", v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="active_members">Active Members</SelectItem>
                <SelectItem value="specific">Specific Members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specific Members */}
          {targetAudience === "specific" && (
            <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
              <Label>Select Members</Label>
              {members.map((m: any) => (
                <div key={m._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={recipients.includes(m._id)}
                    onCheckedChange={() => toggleRecipient(m._id)}
                  />
                  <span className="text-sm">{m.name}</span>
                </div>
              ))}
              {errors.recipients && (
                <p className="text-sm text-destructive">
                  {errors.recipients.message}
                </p>
              )}
            </div>
          )}

          {/* Schedule */}
          <div>
            <Label>Schedule (optional)</Label>
            <Input
              type="datetime-local"
              onChange={(e) =>
                setValue(
                  "scheduledDate",
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Send Notification
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
