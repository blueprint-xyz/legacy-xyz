"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    personalInfoSchema,
    PersonalInfoFormData,
} from "@/core/validations/onboarding";

type Step = "form" | "success";

interface UserData {
    userId: string;
    fullName: string;
    phone: string;
}

export default function OnboardingForm() {
    const [step, setStep] = useState<Step>("form");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [callStatus, setCallStatus] = useState<string | null>(null);
    const [isCallingInProgress, setIsCallingInProgress] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data: PersonalInfoFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Onboarding failed");
            }

            setUserData(result.data);
            setStep("success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMakeTestCall = async () => {
        if (!userData?.phone) return;

        setIsCallingInProgress(true);
        setCallStatus("Initiating call...");

        try {
            const response = await fetch("/api/make-call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: userData.phone,
                    prompt: `You are a friendly AI assistant helping ${userData.fullName} capture their life story. Start by warmly greeting them by name, then ask thoughtful questions about their childhood memories, family traditions, or significant life moments. Be conversational and encouraging. Keep the conversation flowing naturally.`,
                }),
            });

            if (response.ok) {
                setCallStatus("Call initiated! You should receive a call shortly.");
            } else {
                const result = await response.json();
                setCallStatus(`Error: ${result.errors?.[0]?.detail || "Failed to initiate call"}`);
            }
        } catch (err) {
            setCallStatus("Failed to initiate call. Please try again.");
        } finally {
            setIsCallingInProgress(false);
        }
    };

    if (step === "success" && userData) {
        return (
            <div className="w-full max-w-md mx-auto p-8 text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Welcome, {userData.fullName}!
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Your profile has been created successfully.
                    </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                        Phone number registered:
                    </p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {userData.phone}
                    </p>
                </div>

                <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-6">
                    Ready to try our AI assistant? Click the button below to receive
                    a test call. Our AI will help you capture your life story.
                </p>

                <button
                    onClick={handleMakeTestCall}
                    disabled={isCallingInProgress}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {isCallingInProgress ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Calling...
                        </>
                    ) : (
                        <>
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
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                            Make a Test Call
                        </>
                    )}
                </button>

                {callStatus && (
                    <p
                        className={`mt-4 text-sm ${
                            callStatus.startsWith("Error")
                                ? "text-red-500"
                                : "text-green-600 dark:text-green-400"
                        }`}
                    >
                        {callStatus}
                    </p>
                )}
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md mx-auto space-y-6"
        >
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    Tell us about yourself
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    We&apos;ll use this to personalize your experience
                </p>
            </div>

            <div>
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                    Full Name
                </label>
                <input
                    id="fullName"
                    type="text"
                    {...register("fullName")}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                    Phone Number
                </label>
                <input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+15550001234"
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    Include country code (e.g., +1 for US)
                </p>
            </div>

            {error && (
                <p className="text-center text-red-500 text-sm">{error}</p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
                {isSubmitting ? "Creating profile..." : "Continue"}
            </button>
        </form>
    );
}