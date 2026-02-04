// src/components/auth/LoginForm.tsx
import { Dumbbell } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/axios/axios-api";
import { Field, FieldLabel } from "./ui/field";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const signinSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

const signinApi = async (payload: SigninFormValues) => {
  const { data } = await api.post("/auth/signin", payload, {
    withCredentials: true,
  });
  return data;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  });
  const navigate = useNavigate();
  const auth = useAuth();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signinApi,
    onSuccess: (data) => {
      reset();
      // authContext.login(data.user)
      auth.login(data.user);
      setTimeout(() => {
        navigate(`/${data.user.role}`);
      }, 3000);
    },
  });

  const onSubmit = (values: SigninFormValues) => {
    mutate(values);
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Dumbbell className="size-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {/* react form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Server error */}
        {error instanceof AxiosError && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.response?.data?.message || "Signin failed"}
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
            {...register("email")}
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
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
            {...register("password")}
            disabled={isPending}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </Field>

        {/* Submit */}
        <Field>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Signing in…" : "Login"}
          </Button>
        </Field>
      </form>

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
