"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Question {
    _id: string;
    phase: number;
    phaseName: string;
    order: number;
    text: string;
    isActive: boolean;
    createdAt: string;
}

export default function QuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [collapsedPhases, setCollapsedPhases] = useState<Set<number>>(new Set());

    const fetchQuestions = async () => {
        try {
            const response = await fetch("/api/admin/questions");
            if (!response.ok) throw new Error("Failed to fetch questions");
            const data = await response.json();
            setQuestions(data.questions);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleToggleActive = async (questionId: string, currentActive: boolean) => {
        try {
            const response = await fetch(`/api/admin/questions/${questionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentActive }),
            });
            if (!response.ok) throw new Error("Failed to update question");
            fetchQuestions();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to toggle");
        }
    };

    const handleDelete = async (questionId: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return;

        try {
            const response = await fetch(`/api/admin/questions/${questionId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete question");
            fetchQuestions();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete");
        }
    };

    const togglePhase = (phase: number) => {
        setCollapsedPhases((prev) => {
            const next = new Set(prev);
            if (next.has(phase)) {
                next.delete(phase);
            } else {
                next.add(phase);
            }
            return next;
        });
    };

    // Group questions by phase
    const grouped = questions.reduce<Record<number, Question[]>>((acc, q) => {
        if (!acc[q.phase]) acc[q.phase] = [];
        acc[q.phase].push(q);
        return acc;
    }, {});

    const totalActive = questions.filter((q) => q.isActive).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 pt-14">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                href="/"
                                className="text-zinc-400 hover:text-white text-sm mb-2 inline-flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Dashboard
                            </Link>
                            <h1 className="text-xl font-bold text-white">Question Bank</h1>
                            <p className="text-sm text-zinc-400">
                                {questions.length} questions ({totalActive} active) across {Object.keys(grouped).length} phases
                            </p>
                        </div>
                        <Link
                            href="/questions/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Question
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {questions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
                            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No questions configured</h3>
                        <p className="text-zinc-400 mb-6">Run the seed script or create questions manually.</p>
                        <Link
                            href="/questions/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Create Question
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(grouped)
                            .sort(([a], [b]) => Number(a) - Number(b))
                            .map(([phase, phaseQuestions]) => {
                                const phaseNum = Number(phase);
                                const isCollapsed = collapsedPhases.has(phaseNum);
                                const activeCount = phaseQuestions.filter((q) => q.isActive).length;

                                return (
                                    <div
                                        key={phase}
                                        className="bg-zinc-800/50 rounded-lg border border-zinc-700 overflow-hidden"
                                    >
                                        {/* Phase Header */}
                                        <button
                                            onClick={() => togglePhase(phaseNum)}
                                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/80 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg
                                                    className={`w-4 h-4 text-zinc-400 transition-transform ${isCollapsed ? "" : "rotate-90"}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                <span className="text-sm font-mono text-blue-400">Phase {phase}</span>
                                                <h3 className="text-white font-semibold">{phaseQuestions[0]?.phaseName}</h3>
                                            </div>
                                            <span className="text-xs text-zinc-500">
                                                {activeCount}/{phaseQuestions.length} active
                                            </span>
                                        </button>

                                        {/* Questions List */}
                                        {!isCollapsed && (
                                            <div className="border-t border-zinc-700 divide-y divide-zinc-700/50">
                                                {phaseQuestions.map((q) => (
                                                    <div
                                                        key={q._id}
                                                        className={`px-6 py-3 flex items-center gap-4 ${
                                                            q.isActive ? "" : "opacity-50"
                                                        }`}
                                                    >
                                                        <span className="text-xs font-mono text-zinc-500 w-6 text-right shrink-0">
                                                            {q.order}
                                                        </span>
                                                        <p className="text-sm text-zinc-300 flex-1">{q.text}</p>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <button
                                                                onClick={() => handleToggleActive(q._id, q.isActive)}
                                                                className={`px-2 py-1 text-xs rounded transition-colors ${
                                                                    q.isActive
                                                                        ? "text-green-400 hover:bg-green-500/10"
                                                                        : "text-zinc-500 hover:bg-zinc-700"
                                                                }`}
                                                            >
                                                                {q.isActive ? "Active" : "Inactive"}
                                                            </button>
                                                            <Link
                                                                href={`/questions/${q._id}`}
                                                                className="px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(q._id)}
                                                                className="px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </main>
        </div>
    );
}
