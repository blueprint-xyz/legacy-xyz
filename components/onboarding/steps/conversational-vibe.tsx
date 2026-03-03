"use client";

import { useState } from "react";
import type { OnboardingData } from "../onboarding-wizard";
import { conversationalVibeSchema } from "@/core/validations/onboarding";

interface Props {
    data: OnboardingData;
    onUpdate: (fields: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const VIBES = [
    {
        value: "reflective" as const,
        title: "Reflective",
        description: "A deeper, more philosophical pace.",
    },
    {
        value: "casual" as const,
        title: "Casual",
        description: "Like a friendly chat over coffee.",
    },
    {
        value: "direct" as const,
        title: "Direct",
        description: "Focusing on the facts and the timeline.",
    },
];

export default function ConversationalVibe({ data, onUpdate, onNext, onBack }: Props) {
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleNext = () => {
        const result = conversationalVibeSchema.safeParse({
            conversationalVibe: data.conversationalVibe,
        });
        if (!result.success) {
            setValidationError(result.error.errors[0].message);
            return;
        }
        setValidationError(null);
        onNext();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">
                    How would you like our sessions to feel?
                </h2>
            </div>

            <div className="space-y-3">
                {VIBES.map((vibe) => (
                    <button
                        key={vibe.value}
                        type="button"
                        onClick={() => onUpdate({ conversationalVibe: vibe.value })}
                        className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                            data.conversationalVibe === vibe.value
                                ? "border-accent bg-accent/10"
                                : "border-border bg-card hover:border-accent/50"
                        }`}
                    >
                        <p className="font-medium text-foreground">{vibe.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{vibe.description}</p>
                    </button>
                ))}
            </div>

            {validationError && (
                <p className="text-sm text-red-500 text-center">{validationError}</p>
            )}

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
