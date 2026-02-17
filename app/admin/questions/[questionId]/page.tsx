"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const PHASE_OPTIONS = [
    { value: 1, label: "Phase 1: Roots & Early Childhood" },
    { value: 2, label: "Phase 2: Adolescence & Identity Formation" },
    { value: 3, label: "Phase 3: Early Adulthood & Independence" },
    { value: 4, label: "Phase 4: Relationships, Love, & Partnerships" },
    { value: 5, label: "Phase 5: Parenthood & Family Legacy" },
    { value: 6, label: "Phase 6: Career, Craft, & Contribution" },
    { value: 7, label: "Phase 7: Trials, Resilience, & Wisdom" },
    { value: 8, label: "Phase 8: Values & Digital Twin Essence" },
];

const PHASE_NAMES: Record<number, string> = {
    1: "Roots & Early Childhood",
    2: "Adolescence & Identity Formation",
    3: "Early Adulthood & Independence",
    4: "Relationships, Love, & Partnerships",
    5: "Parenthood & Family Legacy",
    6: "Career, Craft, & Contribution",
    7: "Trials, Resilience, & Wisdom",
    8: "Values & Digital Twin Essence",
};

interface QuestionForm {
    phase: number;
    phaseName: string;
    order: number;
    text: string;
    isActive: boolean;
}

const defaultForm: QuestionForm = {
    phase: 1,
    phaseName: "Roots & Early Childhood",
    order: 1,
    text: "",
    isActive: true,
};

export default function QuestionEditPage() {
    const params = useParams();
    const router = useRouter();
    const questionId = params.questionId as string;
    const isNew = questionId === "new";

    const [form, setForm] = useState<QuestionForm>(defaultForm);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isNew) {
            fetchQuestion();
        }
    }, [questionId, isNew]);

    const fetchQuestion = async () => {
        try {
            const response = await fetch(`/api/admin/questions/${questionId}`);
            if (!response.ok) throw new Error("Failed to fetch question");
            const data = await response.json();
            setForm(data.question);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const url = isNew ? "/api/admin/questions" : `/api/admin/questions/${questionId}`;
            const method = isNew ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to save question");
            }

            router.push("/questions");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (name === "phase") {
            const phaseNum = Number(value);
            setForm((prev) => ({
                ...prev,
                phase: phaseNum,
                phaseName: PHASE_NAMES[phaseNum] || prev.phaseName,
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : name === "order"
                    ? Number(value)
                    : value,
        }));
    };

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
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link
                        href="/questions"
                        className="text-zinc-400 hover:text-white text-sm mb-2 inline-flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Questions
                    </Link>
                    <h1 className="text-xl font-bold text-white">
                        {isNew ? "Create New Question" : "Edit Question"}
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Phase & Order */}
                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Classification</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Phase
                                </label>
                                <select
                                    name="phase"
                                    value={form.phase}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                >
                                    {PHASE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Order (within phase)
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    value={form.order}
                                    onChange={handleChange}
                                    required
                                    min={1}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Question Text */}
                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Question</h2>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">
                                Question Text
                            </label>
                            <textarea
                                name="text"
                                value={form.text}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="e.g., What is your very first memory?"
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                            />
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isActive"
                                id="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="text-sm text-zinc-300">
                                Active (will be included in call question queue)
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href="/questions"
                            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
                        >
                            {saving ? "Saving..." : isNew ? "Create Question" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
