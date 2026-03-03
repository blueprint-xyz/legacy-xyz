"use client";

import { useState } from "react";
import type { OnboardingData } from "../onboarding-wizard";
import { personalIdentitySchema } from "@/core/validations/onboarding";

interface Props {
    data: OnboardingData;
    onUpdate: (fields: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function PersonalIdentity({ data, onUpdate, onNext, onBack }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNext = () => {
        const result = personalIdentitySchema.safeParse({
            fullName: data.fullName,
            preferredName: data.preferredName,
        });
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((e) => {
                if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        onNext();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">
                    What is your full name, and what name do you prefer to go by?
                </h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Legal Name *
                    </label>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(e) => onUpdate({ fullName: e.target.value })}
                        placeholder="John Michael Doe"
                        className="w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Preferred Name
                    </label>
                    <input
                        type="text"
                        value={data.preferredName}
                        onChange={(e) => onUpdate({ preferredName: e.target.value })}
                        placeholder="Johnny"
                        className="w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <p className="text-xs text-muted-foreground">
                    I&rsquo;ll use your preferred name during our calls to keep things comfortable.
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 py-3 border border-border text-foreground font-medium rounded-xl transition-colors hover:bg-muted"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 bg-foreground text-background font-medium rounded-xl transition-colors hover:opacity-90"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
