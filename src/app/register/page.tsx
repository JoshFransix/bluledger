/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { m } from "framer-motion";
import { Input, Button } from "@heroui/react";
import { Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isRegisterLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register({ email, password, name: name || undefined });
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-primary/5">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              BluLedger
            </h1>
            <p className="text-muted-foreground">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                {error}
              </m.div>
            )}

            <Input
              type="text"
              label="Name"
              variant="bordered"
              placeholder="John Doe"
              value={name}
              onValueChange={setName}
              description="Optional"
              startContent={<User className="w-4 h-4 text-default-400" />}
            />

            <Input
              type="email"
              label="Email"
              variant="bordered"
              placeholder="you@example.com"
              value={email}
              onValueChange={setEmail}
              isRequired
              startContent={<Mail className="w-4 h-4 text-default-400" />}
            />

            <Input
              type="password"
              label="Password"
              variant="bordered"
              placeholder="••••••••"
              value={password}
              onValueChange={setPassword}
              isRequired
              minLength={8}
              description="Must be at least 8 characters"
              startContent={<Lock className="w-4 h-4 text-default-400" />}
            />

            <Button
              type="submit"
              color="primary"
              isLoading={isRegisterLoading}
              className="w-full font-medium"
              size="lg"
            >
              {isRegisterLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </m.div>
    </div>
  );
}
