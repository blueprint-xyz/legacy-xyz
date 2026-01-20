"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface AgentForm {
    name: string;
    assistantId: string;
    systemPrompt: string;
    firstTimeGreeting: string;
    returningGreeting: string;
    voice: string;
    summaryLength: "short" | "medium" | "long";
    language: string;
    isActive: boolean;
}

const defaultForm: AgentForm = {
    name: "",
    assistantId: "",
    systemPrompt: "You are a friendly AI assistant helping to capture life stories. Ask thoughtful questions about the user's life, memories, and experiences. Be warm, empathetic, and encourage the user to share meaningful stories.",
    firstTimeGreeting: "Hello! It's time for your Legacy interview. I'm here to listen and help you record another chapter of your life story. How are you feeling today?",
    returningGreeting: "Welcome back! It's great to hear from you again. I've been looking forward to continuing your story from where we left off. What would you like to share today?",
    voice: "Telnyx.KokoroTTS.af_bella",
    summaryLength: "short",
    language: "en",
    isActive: false,
};

export default function AgentEditPage() {
    const params = useParams();
    const router = useRouter();
    const agentId = params.agentId as string;
    const isNew = agentId === "new";

    const [form, setForm] = useState<AgentForm>(defaultForm);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isNew) {
            fetchAgent();
        }
    }, [agentId, isNew]);

    const fetchAgent = async () => {
        try {
            const response = await fetch(`/api/admin/agents/${agentId}`);
            if (!response.ok) throw new Error("Failed to fetch agent");
            const data = await response.json();
            setForm(data.agent);
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
            const url = isNew ? "/api/admin/agents" : `/api/admin/agents/${agentId}`;
            const method = isNew ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to save agent");
            }

            router.push("/agents");
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
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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
                        href="/agents"
                        className="text-zinc-400 hover:text-white text-sm mb-2 inline-flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Agents
                    </Link>
                    <h1 className="text-xl font-bold text-white">
                        {isNew ? "Create New Agent" : "Edit Agent"}
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
                    {/* Basic Info */}
                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Agent Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Legacy Interviewer"
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Telnyx Assistant ID
                                </label>
                                <input
                                    type="text"
                                    name="assistantId"
                                    value={form.assistantId}
                                    onChange={handleChange}
                                    required
                                    placeholder="assistant-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500"
                                />
                                <label htmlFor="isActive" className="text-sm text-zinc-300">
                                    Set as active agent (will handle all incoming calls)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Prompts */}
                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Prompts</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    System Prompt (AI Instructions)
                                </label>
                                <textarea
                                    name="systemPrompt"
                                    value={form.systemPrompt}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                                />
                                <p className="mt-1 text-xs text-zinc-500">
                                    The main instructions for the AI. This defines the agent&apos;s personality and behavior.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    First-Time Caller Greeting
                                </label>
                                <textarea
                                    name="firstTimeGreeting"
                                    value={form.firstTimeGreeting}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                                />
                                <p className="mt-1 text-xs text-zinc-500">
                                    What the AI says when the user calls for the first time.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Returning Caller Greeting
                                </label>
                                <textarea
                                    name="returningGreeting"
                                    value={form.returningGreeting}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                                />
                                <p className="mt-1 text-xs text-zinc-500">
                                    What the AI says when a user with previous calls answers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Voice & Settings */}
                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Voice & Settings</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Voice
                                </label>
                                <input
                                    type="text"
                                    name="voice"
                                    value={form.voice}
                                    onChange={handleChange}
                                    required
                                    placeholder="Telnyx.KokoroTTS.af_bella"
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Summary Length
                                </label>
                                <select
                                    name="summaryLength"
                                    value={form.summaryLength}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="short">Short</option>
                                    <option value="medium">Medium</option>
                                    <option value="long">Long</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Language
                                </label>
                                <input
                                    type="text"
                                    name="language"
                                    value={form.language}
                                    onChange={handleChange}
                                    required
                                    placeholder="en"
                                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href="/agents"
                            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
                        >
                            {saving ? "Saving..." : isNew ? "Create Agent" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}