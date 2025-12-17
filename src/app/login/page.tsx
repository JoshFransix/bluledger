/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { m } from "framer-motion";
import { Input, Button } from "@heroui/react";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoginLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              BluLedger
            </h1>
            <p className="text-muted-foreground">Sign in to your account</p>
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
              startContent={<Lock className="w-4 h-4 text-default-400" />}
            />

            <Button
              type="submit"
              color="primary"
              isLoading={isLoginLoading}
              className="w-full font-medium"
              size="lg"
            >
              {isLoginLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </m.div>
    </div>
  );
}
