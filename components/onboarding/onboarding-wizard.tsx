"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Introduction from "./steps/introduction";
import PersonalIdentity from "./steps/personal-identity";
import AnchorPoints from "./steps/anchor-points";
import LifeRoadmap from "./steps/life-roadmap";
import ConversationalVibe from "./steps/conversational-vibe";
import Logistics from "./steps/logistics";
import Confirmation from "./steps/confirmation";

export interface OnboardingData {
    agentName: string;
    isGift: boolean;
    fullName: string;
    preferredName: string;
    dateOfBirth: string;
    birthplace: string;
    lifeChapters: number[];
    conversationalVibe: "" | "reflective" | "casual" | "direct";
    phone: string;
    preferredTimezone: string;
    preferredDay: string;
    preferredTime: string;
}

const INITIAL_DATA: OnboardingData = {
    agentName: "",
    isGift: false,
    fullName: "",
    preferredName: "",
    dateOfBirth: "",
    birthplace: "",
    lifeChapters: [],
    conversationalVibe: "",
    phone: "",
    preferredTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredDay: "",
    preferredTime: "",
};

const STEP_COUNT = 7;

export default function OnboardingWizard() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateData = (fields: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...fields }));
    };

    const next = () => setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    const handleSubmit = async () => {
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
                throw new Error(result.error || "Failed to save");
            }
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setIsSubmitting(false);
        }
    };

    const stepProps = { data, onUpdate: updateData, onNext: next, onBack: back };

    const steps = [
        <Introduction key="intro" {...stepProps} />,
        <PersonalIdentity key="identity" {...stepProps} />,
        <AnchorPoints key="anchor" {...stepProps} />,
        <LifeRoadmap key="roadmap" {...stepProps} />,
        <ConversationalVibe key="vibe" {...stepProps} />,
        <Logistics key="logistics" {...stepProps} />,
        <Confirmation
            key="confirm"
            data={data}
            onBack={back}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
        />,
    ];

    return (
        <div className="w-full max-w-lg mx-auto px-6 py-12">
            {/* Progress bar */}
            <div className="mb-10">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Step {step + 1} of {STEP_COUNT}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
                    />
                </div>
            </div>

            {/* Current step */}
            {steps[step]}
        </div>
    );
}
