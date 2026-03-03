"use client";

import { useState } from "react";
import type { OnboardingData } from "../onboarding-wizard";
import { lifeRoadmapSchema } from "@/core/validations/onboarding";

interface Props {
    data: OnboardingData;
    onUpdate: (fields: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const CHAPTERS = [
    { id: 1, title: "The Beginning", subtitle: "Childhood & Home", emoji: "\u{1F3E0}" },
    { id: 2, title: "Growing Up", subtitle: "School & Identity", emoji: "\u{1F4DA}" },
    { id: 3, title: "Striking Out", subtitle: "Early Adulthood", emoji: "\u{1F305}" },
    { id: 4, title: "Finding Love", subtitle: "Partnership & Marriage", emoji: "\u{1F495}" },
    { id: 5, title: "Raising Family", subtitle: "Parenting & Kids", emoji: "\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}" },
    { id: 6, title: "Work Life", subtitle: "Career & Passion", emoji: "\u{1F4BC}" },
    { id: 7, title: "Life's Tests", subtitle: "Resilience & Hardship", emoji: "\u{26F0}\u{FE0F}" },
    { id: 8, title: "My Wisdom", subtitle: "Values & Beliefs", emoji: "\u{2728}" },
];

export default function LifeRoadmap({ data, onUpdate, onNext, onBack }: Props) {
    const [validationError, setValidationError] = useState<string | null>(null);

    const toggleChapter = (id: number) => {
        const current = data.lifeChapters;
        if (current.includes(id)) {
            onUpdate({ lifeChapters: current.filter((c) => c !== id) });
        } else if (current.length < 3) {
            onUpdate({ lifeChapters: [...current, id] });
        }
    };

    const handleNext = () => {
        const result = lifeRoadmapSchema.safeParse({ lifeChapters: data.lifeChapters });
        if (!result.success) {
            setValidationError(result.error.issues[0].message);
            return;
        }
        setValidationError(null);
        onNext();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">
                    Which chapters should we prioritize first?
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Select up to 3</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {CHAPTERS.map((chapter) => {
                    const selected = data.lifeChapters.includes(chapter.id);
                    const disabled = !selected && data.lifeChapters.length >= 3;
                    return (
                        <button
                            key={chapter.id}
                            type="button"
                            onClick={() => toggleChapter(chapter.id)}
                            disabled={disabled}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                selected
                                    ? "border-accent bg-accent/10"
                                    : disabled
                                      ? "border-border bg-card opacity-40 cursor-not-allowed"
                                      : "border-border bg-card hover:border-accent/50"
                            }`}
                        >
                            <span className="text-2xl">{chapter.emoji}</span>
                            <p className="font-medium text-foreground mt-2 text-sm">
                                {chapter.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{chapter.subtitle}</p>
                        </button>
                    );
                })}
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
