"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  LoginFormData,
  RegisterFormData,
} from "@/core/validations/auth";
import Link from "next/link";

type AuthMode = "login" | "register";

export default function SignInPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            window.location.href = "/dashboard";
          }
        }
      } catch {
        // Not authenticated, stay on page
      }
    }
    checkAuth();
  }, []);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setSuccess("Account created! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 pt-24 pb-16 font-sans">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 group"
          >
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
              <svg
                className="w-4 h-4 text-background"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Legacy
            </span>
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
            {mode === "login"
              ? "Welcome back"
              : "Start preserving your stories"}
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {mode === "login"
              ? "Sign in to continue capturing your legacy."
              : "Create an account to begin recording the moments that matter."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-muted rounded-lg p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                mode === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                mode === "register"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Login Form */}
          {mode === "login" ? (
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="login-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  {...loginForm.register("email")}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-600">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  {...loginForm.register("password")}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-600">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-700 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-1 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="register-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  {...registerForm.register("email")}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-xs text-red-600">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="register-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  {...registerForm.register("password")}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-red-600">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="register-confirm"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm Password
                </label>
                <input
                  id="register-confirm"
                  type="password"
                  {...registerForm.register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-600">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-700 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-1 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? (
            <>
              {"Don't have an account? "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-foreground font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              {"Already have an account? "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-foreground font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
