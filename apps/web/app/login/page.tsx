"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@repo/shared";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { authClient } from "@/lib/auth-client";

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message ?? "Login failed");
        return;
      }

      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Check the credentials properly , password and email could be invalid"
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-muted/40 to-muted px-8">
      <Card className="w-full max-w-xl rounded-3xl border border-border/50 bg-background/90 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-6 px-16 pt-16 pb-8 text-center">
          <CardTitle className="font-extrabold text-5xl tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Login to your account and continue managing your tasks.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-16 pb-16">
          <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Label className="font-semibold text-base">Email</Label>
              <Input
                className="h-14 rounded-xl text-base"
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

            {/* Password */}
            <div className="space-y-4">
              <Label className="font-semibold text-base">Password</Label>
              <div className="relative">
                <Input
                  className="h-14 rounded-xl pr-14 text-base"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <button
                  className="absolute top-1/2 right-5 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="font-medium text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              className="h-14 w-full rounded-xl font-semibold text-lg shadow-lg transition-all hover:scale-[1.02]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-12 flex items-center justify-between text-center">
            <p className="text-base text-muted-foreground">
              Don’t have an account?
            </p>
            <Link
              className="font-semibold text-primary hover:underline"
              href="/register"
            >
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
