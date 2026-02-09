import { Dumbbell } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldLabel } from "./ui/field";

import { useAuth } from "@/hooks/useAuth";
import {
  signinSchema,
  type SigninFormValues,
} from "@/validators/auth/auth.schema";
import { signinApi } from "@/api/auth/auth.api";
import type { ApiError } from "@/types/api.types";

/* --------------------------- COMPONENT --------------------------- */

export function LoginForm() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [form, setForm] = useState<SigninFormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SigninFormValues, string>>
  >({});

  /* --------------------------- MUTATION --------------------------- */

  const { mutate, isPending, error } = useMutation({
    mutationFn: signinApi,
    onSuccess: (data) => {
      auth.login(data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      setForm({ email: "", password: "" });
      setErrors({});
      navigate(`/${data.user.role}`);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.error ?? "Signin failed");
    },
  });

  /* --------------------------- HANDLERS --------------------------- */

  const handleChange = (key: keyof SigninFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    const result = signinSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((e) => {
        const field = e.path[0] as keyof SigninFormValues;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    mutate(result.data);
  };

  /* ----------------------------- UI ------------------------------ */

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Dumbbell className="size-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <div className="space-y-4">
        {/* Server error */}
        {error instanceof AxiosError && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.response?.data?.message ?? "Signin failed"}
            </AlertDescription>
          </Alert>
        )}

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={isPending}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </Field>

        {/* Password */}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={isPending}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </Field>

        {/* Submit */}
        <Field>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Signing in…" : "Login"}
          </Button>
        </Field>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        By continuing, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
