"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TranscriptEntry {
    role: "user" | "assistant";
    text: string;
    timestamp: string;
}

interface CallRecord {
    _id: string;
    startedAt: string;
    endedAt: string | null;
    durationSeconds: number | null;
    summary: string | null;
    fullTranscript: string | null;
    recordingUrl: string | null;
    status: string;
    transcript: TranscriptEntry[];
}

interface User {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
}

export default function UserDetailPage() {
    const params = useParams();
    const userId = params.userId as string;

    const [user, setUser] = useState<User | null>(null);
    const [callRecords, setCallRecords] = useState<CallRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCall, setExpandedCall] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch(`/api/admin/users/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch user data");
                const data = await response.json();
                setUser(data.user);
                setCallRecords(data.callRecords);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "N/A";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            completed: "bg-green-500/10 text-green-400",
            in_progress: "bg-yellow-500/10 text-yellow-400",
            failed: "bg-red-500/10 text-red-400",
            initiated: "bg-blue-500/10 text-blue-400",
        };
        return styles[status] || "bg-zinc-500/10 text-zinc-400";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || "User not found"}</p>
                    <Link href="/" className="text-blue-400 hover:text-blue-300">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link
                        href="/"
                        className="text-zinc-400 hover:text-white text-sm mb-2 inline-flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Users
                    </Link>
                    <h1 className="text-xl font-bold text-white">{user.fullName}</h1>
                    <p className="text-sm text-zinc-400">{user.email} | {user.phone}</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4">
                        <p className="text-sm text-zinc-400">Total Calls</p>
                        <p className="text-2xl font-bold text-white">{callRecords.length}</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4">
                        <p className="text-sm text-zinc-400">Total Duration</p>
                        <p className="text-2xl font-bold text-white">
                            {formatDuration(
                                callRecords.reduce((acc, call) => acc + (call.durationSeconds || 0), 0)
                            )}
                        </p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4">
                        <p className="text-sm text-zinc-400">Member Since</p>
                        <p className="text-2xl font-bold text-white">
                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {/* Call Records */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-white">Call History</h2>
                    <p className="text-sm text-zinc-400">All recorded calls and transcripts</p>
                </div>

                {callRecords.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400">
                        No calls recorded yet
                    </div>
                ) : (
                    <div className="space-y-4">
                        {callRecords.map((call) => (
                            <div
                                key={call._id}
                                className="bg-zinc-800/50 rounded-lg border border-zinc-700 overflow-hidden"
                            >
                                {/* Call Header */}
                                <div
                                    className="p-4 cursor-pointer hover:bg-zinc-800 transition-colors"
                                    onClick={() =>
                                        setExpandedCall(expandedCall === call._id ? null : call._id)
                                    }
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-medium text-white">
                                                    {formatDate(call.startedAt)}
                                                </p>
                                                <p className="text-sm text-zinc-400">
                                                    Duration: {formatDuration(call.durationSeconds)}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                                    call.status
                                                )}`}
                                            >
                                                {call.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {call.recordingUrl && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPlayingAudio(
                                                            playingAudio === call._id ? null : call._id
                                                        );
                                                    }}
                                                    className="text-blue-400 hover:text-blue-300 p-2"
                                                    title="Play recording"
                                                >
                                                    {playingAudio === call._id ? (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                            <svg
                                                className={`w-5 h-5 text-zinc-400 transition-transform ${
                                                    expandedCall === call._id ? "rotate-180" : ""
                                                }`}
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
                                        </div>
                                    </div>

                                    {/* Summary Preview */}
                                    {call.summary ? (
                                        <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                                            {call.summary}
                                        </p>
                                    ) : call.status === "completed" ? (
                                        <p className="mt-2 text-sm text-zinc-500 italic flex items-center gap-2">
                                            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Summary is being generated, please check again later...
                                        </p>
                                    ) : null}
                                </div>

                                {/* Audio Player */}
                                {playingAudio === call._id && call.recordingUrl && (
                                    <div className="px-4 pb-4">
                                        <audio
                                            controls
                                            autoPlay
                                            className="w-full"
                                            src={call.recordingUrl}
                                            onEnded={() => setPlayingAudio(null)}
                                        >
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                )}

                                {/* Expanded Content */}
                                {expandedCall === call._id && (
                                    <div className="border-t border-zinc-700 p-4 space-y-4">
                                        {/* Full Summary */}
                                        <div>
                                            <h4 className="text-sm font-medium text-zinc-300 mb-2">
                                                Summary
                                            </h4>
                                            {call.summary ? (
                                                <p className="text-sm text-zinc-400 bg-zinc-900/50 rounded p-3">
                                                    {call.summary}
                                                </p>
                                            ) : (
                                                <div className="text-sm text-zinc-500 italic bg-zinc-900/50 rounded p-3 flex items-center gap-2">
                                                    <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Summary is being generated, please check again later...
                                                </div>
                                            )}
                                        </div>

                                        {/* Transcript */}
                                        <div>
                                            <h4 className="text-sm font-medium text-zinc-300 mb-2">
                                                Transcript
                                            </h4>
                                            {call.fullTranscript ? (
                                                <div className="bg-zinc-900/50 rounded p-4">
                                                    <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                                                        {call.fullTranscript}
                                                    </p>
                                                </div>
                                            ) : call.status === "completed" ? (
                                                <div className="text-sm text-zinc-500 italic bg-zinc-900/50 rounded p-3 flex items-center gap-2">
                                                    <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Transcript is being generated, please check again later...
                                                </div>
                                            ) : (
                                                <div className="text-sm text-zinc-500 italic bg-zinc-900/50 rounded p-3">
                                                    No transcript available for this call.
                                                </div>
                                            )}
                                        </div>

                                        {/* Recording Download */}
                                        {call.recordingUrl && (
                                            <div>
                                                <a
                                                    href={call.recordingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                        />
                                                    </svg>
                                                    Download Recording
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}