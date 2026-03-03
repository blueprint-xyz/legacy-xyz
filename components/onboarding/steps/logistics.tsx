"use client";

import { useState } from "react";
import type { OnboardingData } from "../onboarding-wizard";
import { logisticsSchema } from "@/core/validations/onboarding";

interface Props {
    data: OnboardingData;
    onUpdate: (fields: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIMEZONES = Intl.supportedValuesOf("timeZone");

function generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let h = 8; h <= 20; h++) {
        slots.push(`${h.toString().padStart(2, "0")}:00`);
        slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
}

const TIME_SLOTS = generateTimeSlots();

export default function Logistics({ data, onUpdate, onNext, onBack }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNext = () => {
        const result = logisticsSchema.safeParse({
            phone: data.phone,
            preferredTimezone: data.preferredTimezone,
            preferredDay: data.preferredDay,
            preferredTime: data.preferredTime,
        });
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((e) => {
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
                    When is the best time for us to speak?
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    We recommend a time when you can be in a quiet, comfortable chair.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => onUpdate({ phone: e.target.value })}
                        placeholder="+15550001234"
                        className="w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                        Include country code (e.g., +1 for US)
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Timezone *
                    </label>
                    <select
                        value={data.preferredTimezone}
                        onChange={(e) => onUpdate({ preferredTimezone: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {TIMEZONES.map((tz) => (
                            <option key={tz} value={tz}>
                                {tz.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>
                    {errors.preferredTimezone && (
                        <p className="mt-1 text-sm text-red-500">{errors.preferredTimezone}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Preferred Day *
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {DAYS.map((day) => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => onUpdate({ preferredDay: day.toLowerCase() })}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    data.preferredDay === day.toLowerCase()
                                        ? "bg-accent text-accent-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-accent/20"
                                }`}
                            >
                                {day.slice(0, 3)}
                            </button>
                        ))}
                    </div>
                    {errors.preferredDay && (
                        <p className="mt-1 text-sm text-red-500">{errors.preferredDay}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Preferred Time *
                    </label>
                    <select
                        value={data.preferredTime}
                        onChange={(e) => onUpdate({ preferredTime: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Select a time</option>
                        {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>
                    {errors.preferredTime && (
                        <p className="mt-1 text-sm text-red-500">{errors.preferredTime}</p>
                    )}
                </div>
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
