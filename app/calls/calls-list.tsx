"use client";

import { useState } from "react";

interface Call {
    id: string;
    startedAt: string | null;
    endedAt: string | null;
    durationSeconds: number | null;
    summary: string | null;
    recordingUrl: string | null;
    fullTranscript: string | null;
    status: string;
}

interface CallsListProps {
    calls: Call[];
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

function CallCard({ call }: { call: Call }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary");

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Card Header */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            {call.startedAt ? formatDate(call.startedAt) : "Unknown date"}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {call.startedAt ? formatTime(call.startedAt) : ""}{" "}
                            {call.durationSeconds && `· ${formatDuration(call.durationSeconds)}`}
                        </p>
                    </div>
                    <span
                        className={`text-xs px-2 py-1 rounded-full ${
                            call.status === "completed"
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                : call.status === "in_progress"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                    >
                        {call.status === "completed" ? "Completed" : call.status === "in_progress" ? "In Progress" : call.status}
                    </span>
                </div>

                {/* Audio Player */}
                {call.recordingUrl && (
                    <audio
                        controls
                        className="w-full h-10 mb-3"
                        preload="none"
                    >
                        <source src={call.recordingUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}

                {/* Expand/Collapse Button */}
                {(call.summary || call.fullTranscript) && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                        <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        {isExpanded ? "Hide details" : "Show details"}
                    </button>
                )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (call.summary || call.fullTranscript) && (
                <div className="border-t border-zinc-200 dark:border-zinc-800">
                    {/* Tabs */}
                    <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                        {call.summary && (
                            <button
                                onClick={() => setActiveTab("summary")}
                                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                    activeTab === "summary"
                                        ? "text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                                }`}
                            >
                                Summary
                            </button>
                        )}
                        {call.fullTranscript && (
                            <button
                                onClick={() => setActiveTab("transcript")}
                                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                    activeTab === "transcript"
                                        ? "text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                                }`}
                            >
                                Transcript
                            </button>
                        )}
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                        {activeTab === "summary" && call.summary && (
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {call.summary}
                            </p>
                        )}
                        {activeTab === "transcript" && call.fullTranscript && (
                            <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
                                {call.fullTranscript}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CallsList({ calls }: CallsListProps) {
    return (
        <div className="space-y-4">
            {calls.map((call) => (
                <CallCard key={call.id} call={call} />
            ))}
        </div>
    );
}