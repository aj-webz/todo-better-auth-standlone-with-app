"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@repo/shared";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { authClient } from "@/lib/auth-client";

type RegisterFormInput = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(RegisterSchema) });

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: async (values: RegisterFormInput) => {
      const { data, error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (error) {
        switch (error.status) {
          case 422:
            throw new Error("User already exists with this email!");
          case 400:
            throw new Error("Invalid email or password format!");
          case 500:
            throw new Error("Server error! Please try again later.");
          default:
            throw new Error(error.message ?? "Sign up failed!");
        }
      }
      return data;
    },
    onSuccess: () => {
      window.alert("Account created successfully! please login.");
    },
    onError: (error: Error) => {
      window.alert(`Registration failed: ${error.message}`);
    },
  });

  function onSubmit(data: RegisterFormInput) {
    registerUser(data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/40 to-muted px-6">
      <Card className="w-full max-w-xl rounded-3xl border border-border/50 bg-background/90 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-5 px-12 pt-14 pb-6 text-center">
          <CardTitle className="font-extrabold text-4xl tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Join Todo Tracker and start organizing your tasks.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-12 pb-14">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <Label className="font-semibold text-sm">Name</Label>
              <Input
                className="h-12 rounded-xl text-base"
                placeholder="Enter your name"
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <p className="font-medium text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="font-semibold text-sm">Email</Label>
              <Input
                className="h-12 rounded-xl text-base"
                placeholder="Enter your email"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="font-medium text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="font-semibold text-sm">Password</Label>
              <div className="relative">
                <Input
                  className="h-12 rounded-xl pr-12 text-base"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <button
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="font-medium text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="font-semibold text-sm">Confirm Password</Label>
              <div className="relative">
                <Input
                  className="h-12 rounded-xl pr-12 text-base"
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                />
                <button
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  type="button"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="font-medium text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              className="h-12 w-full rounded-xl font-semibold text-base shadow-lg transition-all hover:scale-[1.02]"
              disabled={isSubmitting || isPending}
              type="submit"
            >
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-12 flex items-center justify-between text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
            </p>
            <Link
              className="font-semibold text-primary hover:underline"
              href="/login"
            >
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
