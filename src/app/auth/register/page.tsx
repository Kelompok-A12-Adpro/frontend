"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { register } from "@/lib/auth";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import { Alert, AlertDescription } from "@/components/molecules/Alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await register(form);
      console.log("🎉 Registration successful:", result);
      router.push("/auth/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ?? err.message ?? "Registration failed.";
        console.error("🔴 Registration error:", err.response ?? err);
        setError(message);
      } else {
        console.error("🔴 Unexpected error:", err);
        setError("Unexpected error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((v) => !v);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/Background.jpg')" }}
    >
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/70 shadow-lg">
        <CardHeader className="space-y-2">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={208}
            height={64}
            className="mx-auto my-4"
          />
          <CardTitle className="text-h4 text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-small text-center text-neutral-500">
            Enter your details to start gathering love 💌
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription className="text-neutral-50">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-small">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-body bg-neutral-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-small">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="text-body bg-neutral-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-small">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="text-body pr-10 bg-neutral-50"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 hover:text-neutral-700"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-small">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="081234567890"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="text-body bg-neutral-50"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-small text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary-400 hover:text-primary-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
