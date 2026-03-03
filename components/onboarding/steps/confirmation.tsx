"use client";

import type { OnboardingData } from "../onboarding-wizard";

const CHAPTER_NAMES: Record<number, string> = {
    1: "The Beginning",
    2: "Growing Up",
    3: "Striking Out",
    4: "Finding Love",
    5: "Raising Family",
    6: "Work Life",
    7: "Life's Tests",
    8: "My Wisdom",
};

interface Props {
    data: OnboardingData;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    error: string | null;
}

export default function Confirmation({ data, onBack, onSubmit, isSubmitting, error }: Props) {
    const displayName = data.preferredName || data.fullName.split(" ")[0];
    const dayCapitalized = data.preferredDay.charAt(0).toUpperCase() + data.preferredDay.slice(1);

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <p className="text-lg leading-relaxed text-foreground">
                    &ldquo;Excellent. I have everything I need to get started. I&rsquo;ll call you
                    on <span className="font-semibold">{dayCapitalized}s</span> at{" "}
                    <span className="font-semibold">{data.preferredTime}</span>. I&rsquo;m looking
                    forward to hearing your story,{" "}
                    <span className="font-semibold">{displayName}</span>.&rdquo;
                </p>
                <p className="text-sm text-muted-foreground">&mdash; {data.agentName}, your biographer</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 space-y-3 text-sm">
                <Row label="Name" value={data.fullName} />
                {data.preferredName && <Row label="Goes by" value={data.preferredName} />}
                <Row label="Born" value={`${data.dateOfBirth} in ${data.birthplace}`} />
                <Row
                    label="Chapters"
                    value={data.lifeChapters.map((c) => CHAPTER_NAMES[c]).join(", ")}
                />
                <Row label="Vibe" value={data.conversationalVibe} />
                <Row label="Phone" value={data.phone} />
                <Row label="Schedule" value={`${dayCapitalized}s at ${data.preferredTime}`} />
                <Row label="Timezone" value={data.preferredTimezone.replace(/_/g, " ")} />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="flex-1 py-3 border border-border text-foreground font-medium rounded-xl transition-colors hover:bg-muted disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-foreground text-background font-medium rounded-xl transition-colors hover:opacity-90 disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Confirm"}
                </button>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-foreground font-medium text-right max-w-[60%]">{value}</span>
        </div>
    );
}
