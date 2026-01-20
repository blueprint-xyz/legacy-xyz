"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    loginSchema,
    registerSchema,
    LoginFormData,
    RegisterFormData,
} from "@/core/validations/auth";

type AuthMode = "login" | "register";

interface User {
    id: string;
    email: string;
    fullName?: string;
}

export default function AuthModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<AuthMode>("login");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Check auth status on mount
    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("/api/auth/me");
                if (response.ok) {
                    const data = await response.json();
                    if (data.authenticated) {
                        setUser(data.user);
                    }
                }
            } catch {
                // Not authenticated
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

            setSuccess("Login successful!");
            setTimeout(() => {
                setIsOpen(false);
                window.location.reload();
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

            setSuccess("Account created successfully!");
            setTimeout(() => {
                setIsOpen(false);
                window.location.reload();
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

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/";
        } catch {
            // Handle error silently
        }
    };

    if (isLoading) {
        return (
            <div className="px-4 py-2">
                <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.fullName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.fullName || user.email}</span>
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50">
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                {user.fullName || "User"}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {user.email}
                            </p>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
                <span>Sign In</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-50">
                    {/* Tabs */}
                    <div className="flex border-b border-zinc-200 dark:border-zinc-700">
                        <button
                            onClick={() => switchMode("login")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                mode === "login"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => switchMode("register")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                                mode === "register"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    <div className="p-4">
                        {mode === "login" ? (
                            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="login-email"
                                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="login-email"
                                        type="email"
                                        {...loginForm.register("email")}
                                        placeholder="john@example.com"
                                        className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {loginForm.formState.errors.email && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {loginForm.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="login-password"
                                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="login-password"
                                        type="password"
                                        {...loginForm.register("password")}
                                        placeholder="Enter your password"
                                        className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {loginForm.formState.errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {loginForm.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {error && <p className="text-sm text-red-500">{error}</p>}
                                {success && <p className="text-sm text-green-600">{success}</p>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {isSubmitting ? "Signing in..." : "Sign In"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="register-email"
                                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="register-email"
                                        type="email"
                                        {...registerForm.register("email")}
                                        placeholder="john@example.com"
                                        className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {registerForm.formState.errors.email && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {registerForm.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="register-password"
                                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="register-password"
                                        type="password"
                                        {...registerForm.register("password")}
                                        placeholder="Create a password"
                                        className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {registerForm.formState.errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {registerForm.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="register-confirm"
                                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="register-confirm"
                                        type="password"
                                        {...registerForm.register("confirmPassword")}
                                        placeholder="Confirm your password"
                                        className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {registerForm.formState.errors.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {registerForm.formState.errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                {error && <p className="text-sm text-red-500">{error}</p>}
                                {success && <p className="text-sm text-green-600">{success}</p>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {isSubmitting ? "Creating account..." : "Create Account"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}