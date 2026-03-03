"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
    id: string;
    email: string;
    fullName?: string;
    preferredName?: string;
    agentName?: string;
    dateOfBirth?: string;
    birthplace?: string;
    lifeChapters?: number[];
    conversationalVibe?: string;
    phone?: string;
    onboardingCompleted: boolean;
}

const CHAPTER_NAMES: Record<number, string> = {
    1: "Childhood & Home",
    2: "School & Identity",
    3: "Early Adulthood",
    4: "Partnership & Marriage",
    5: "Parenting & Kids",
    6: "Career & Passion",
    7: "Resilience & Hardship",
    8: "Values & Beliefs",
};

function buildCallPrompt(user: User): string {
    const name = user.preferredName || user.fullName?.split(" ")[0] || "there";
    const chapters = user.lifeChapters?.map((c) => CHAPTER_NAMES[c]).join(", ") || "";
    const vibe = user.conversationalVibe || "casual";

    const vibeInstructions: Record<string, string> = {
        reflective: "Take a deeper, more philosophical pace. Allow for pauses and contemplation. Ask 'why' and 'how did that shape you' questions.",
        casual: "Keep it conversational, like a friendly chat over coffee. Be warm and use natural language.",
        direct: "Focus on facts, events, and the timeline. Be clear and structured in your questions.",
    };

    return [
        `You are ${user.agentName || "Legacy"}, a personal biographer.`,
        `You are speaking with ${user.fullName} (call them "${name}").`,
        user.birthplace ? `They were born in ${user.birthplace}${user.dateOfBirth ? ` on ${user.dateOfBirth}` : ""}.` : "",
        chapters ? `Prioritized life chapters to explore: ${chapters}.` : "",
        `Conversational style: ${vibeInstructions[vibe] || vibeInstructions.casual}`,
        `Your goal is to help ${name} capture their life story as a lasting legacy for their family.`,
        `Start by warmly greeting them by name, then guide the conversation through their prioritized chapters.`,
        `Be an excellent listener. Ask follow-up questions. Keep the conversation flowing naturally.`,
    ].filter(Boolean).join(" ");
}

type View = "loading" | "unauthenticated" | "welcome";

export default function Dashboard() {
    const [view, setView] = useState<View>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [callStatus, setCallStatus] = useState<string | null>(null);
    const [isCallingInProgress, setIsCallingInProgress] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("/api/auth/me");
                if (response.ok) {
                    const data = await response.json();
                    if (data.authenticated) {
                        setUser(data.user);
                        if (data.user.onboardingCompleted) {
                            setView("welcome");
                        } else {
                            router.push("/onboarding");
                            return;
                        }
                        return;
                    }
                }
                setView("unauthenticated");
            } catch {
                setView("unauthenticated");
            }
        }
        checkAuth();
    }, []);

    const handleMakeTestCall = async () => {
        if (!user?.phone) return;

        setIsCallingInProgress(true);
        setCallStatus("Initiating call...");

        try {
            const response = await fetch("/api/make-call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: user.phone,
                    prompt: buildCallPrompt(user),
                }),
            });

            if (response.ok) {
                setCallStatus("Call initiated! You should receive a call shortly.");
            } else {
                const result = await response.json();
                setCallStatus(`Error: ${result.errors?.[0]?.detail || "Failed to initiate call"}`);
            }
        } catch {
            setCallStatus("Failed to initiate call. Please try again.");
        } finally {
            setIsCallingInProgress(false);
        }
    };

    if (view === "loading") {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-zinc-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (view === "unauthenticated") {
        return (
            <div className="w-full max-w-md mx-auto p-8 text-center">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    Welcome to Legacy XYZ
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    Please sign in or create an account to get started with preserving your life stories.
                </p>

            </div>
        );
    }

    // Welcome view
    const firstName = user?.preferredName || user?.fullName?.split(" ")[0] || "there";

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Greeting */}
            <div className="text-center mb-10">
                <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium tracking-wide uppercase mb-2">
                    Welcome back
                </p>
                <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white">
                    {firstName}
                </h2>
            </div>

            {/* Main CTA */}
            <div className="mb-6">
                <button
                    onClick={handleMakeTestCall}
                    disabled={isCallingInProgress}
                    className="group w-full relative overflow-hidden rounded-2xl bg-zinc-900 dark:bg-white p-6 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-zinc-400 dark:text-zinc-500 text-xs font-medium tracking-wide uppercase mb-1">
                                {isCallingInProgress ? "Calling..." : "Ready when you are"}
                            </p>
                            <p className="text-white dark:text-zinc-900 text-xl font-semibold">
                                {isCallingInProgress ? user?.phone : "Start new call"}
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center transition-transform group-hover:scale-110">
                            {isCallingInProgress ? (
                                <svg
                                    className="animate-spin h-6 w-6 text-zinc-900 dark:text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6 text-zinc-900 dark:text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </div>
                    </div>
                </button>
                {callStatus && (
                    <p
                        className={`mt-3 text-center text-sm ${
                            callStatus.startsWith("Error")
                                ? "text-red-500"
                                : "text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                        {callStatus}
                    </p>
                )}
            </div>

            {/* Quick Links */}
            <div className="flex items-center justify-center gap-6">
                <Link
                    href="/calls"
                    className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
                >
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                        </svg>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Calls</span>
                </Link>

                <div className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed relative">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Schedule</span>
                    <span className="absolute -top-1 -right-1 text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-full">
                        Soon
                    </span>
                </div>
            </div>

            {/* Footer Info */}
            <p className="text-center text-zinc-400 dark:text-zinc-600 text-xs mt-10">
                New calls will made to {user?.phone}
            </p>
        </div>
    );
}
