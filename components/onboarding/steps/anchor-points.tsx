"use client";

import { useState } from "react";
import type { OnboardingData } from "../onboarding-wizard";
import { anchorPointsSchema } from "@/core/validations/onboarding";

interface Props {
    data: OnboardingData;
    onUpdate: (fields: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function AnchorPoints({ data, onUpdate, onNext, onBack }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNext = () => {
        const result = anchorPointsSchema.safeParse({
            dateOfBirth: data.dateOfBirth,
            birthplace: data.birthplace,
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
                    Every story has a beginning. When and where did yours start?
                </h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Date of Birth *
                    </label>
                    <input
                        type="date"
                        value={data.dateOfBirth}
                        onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Birthplace *
                    </label>
                    <input
                        type="text"
                        value={data.birthplace}
                        onChange={(e) => onUpdate({ birthplace: e.target.value })}
                        placeholder="Brooklyn, New York"
                        className="w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.birthplace && (
                        <p className="mt-1 text-sm text-red-500">{errors.birthplace}</p>
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    Knowing your era and hometown helps me understand the world you grew up in.
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
