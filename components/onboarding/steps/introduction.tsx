"use client";

import { useState } from "react";
import type { OnboardingData } from "../onboarding-wizard";
import { introductionSchema } from "@/core/validations/onboarding";

interface Props {
    data: OnboardingData;
    onUpdate: (fields: Partial<OnboardingData>) => void;
    onNext: () => void;
}

const AGENT_NAMES = ["Eleanor", "James", "Margaret", "Arthur"];

export default function Introduction({ data, onUpdate, onNext }: Props) {
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleNext = () => {
        const result = introductionSchema.safeParse({
            agentName: data.agentName,
            isGift: data.isGift,
        });
        if (!result.success) {
            setValidationError(result.error.issues[0].message);
            return;
        }
        setValidationError(null);
        onNext();
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <p className="text-lg leading-relaxed text-foreground">
                    &ldquo;Hello. I&rsquo;m your personal biographer. I&rsquo;m here to help you
                    turn your memories into a lasting legacy for your family. Before our first
                    conversation, I&rsquo;d love to learn a little about your journey so I can be
                    the best possible listener.&rdquo;
                </p>
            </div>

            <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Choose your biographer</p>
                <div className="grid grid-cols-2 gap-3">
                    {AGENT_NAMES.map((name) => (
                        <button
                            key={name}
                            type="button"
                            onClick={() => onUpdate({ agentName: name })}
                            className={`p-4 rounded-xl border-2 text-center font-medium transition-all ${
                                data.agentName === name
                                    ? "border-accent bg-accent/10 text-foreground"
                                    : "border-border bg-card text-foreground hover:border-accent/50"
                            }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
                {validationError && (
                    <p className="text-sm text-red-500">{validationError}</p>
                )}
            </div>

            <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
                <input
                    type="checkbox"
                    checked={data.isGift}
                    onChange={(e) => onUpdate({ isGift: e.target.checked })}
                    className="w-4 h-4 rounded border-border accent-accent"
                />
                This is a gift for a loved one
            </label>

            <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 bg-foreground text-background font-medium rounded-xl transition-colors hover:opacity-90"
            >
                Get Started
            </button>
        </div>
    );
}
