"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    personalInfoSchema,
    PersonalInfoFormData,
} from "@/core/validations/onboarding";

interface OnboardingFormProps {
    initialData?: {
        fullName?: string;
        phone?: string;
    };
    isEditMode?: boolean;
    onSuccess?: (data: { fullName: string; phone: string }) => void;
    onCancel?: () => void;
}

export default function OnboardingForm({
    initialData,
    isEditMode = false,
    onSuccess,
    onCancel,
}: OnboardingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            fullName: initialData?.fullName || "",
            phone: initialData?.phone || "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data: PersonalInfoFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/onboarding", {
                method: isEditMode ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save");
            }

            onSuccess?.({
                fullName: result.data.fullName,
                phone: result.data.phone,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md mx-auto space-y-6"
        >
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    {isEditMode ? "Update your information" : "Tell us about yourself"}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {isEditMode
                        ? "Update your profile details"
                        : "We'll use this to personalize your experience"}
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

            <div className="flex gap-3">
                {isEditMode && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${isEditMode && onCancel ? "flex-1" : "w-full"} py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors`}
                >
                    {isSubmitting
                        ? isEditMode
                            ? "Saving..."
                            : "Creating profile..."
                        : isEditMode
                            ? "Save Changes"
                            : "Continue"}
                </button>
            </div>
        </form>
    );
}