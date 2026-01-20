"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Agent {
    _id: string;
    name: string;
    assistantId: string;
    systemPrompt: string;
    firstTimeGreeting: string;
    returningGreeting: string;
    voice: string;
    summaryLength: string;
    language: string;
    isActive: boolean;
    createdAt: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAgents = async () => {
        try {
            const response = await fetch("/api/admin/agents");
            if (!response.ok) throw new Error("Failed to fetch agents");
            const data = await response.json();
            setAgents(data.agents);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleSetActive = async (agentId: string) => {
        try {
            const response = await fetch(`/api/admin/agents/${agentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: true }),
            });
            if (!response.ok) throw new Error("Failed to update agent");
            fetchAgents();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to set active");
        }
    };

    const handleDelete = async (agentId: string) => {
        if (!confirm("Are you sure you want to delete this agent?")) return;

        try {
            const response = await fetch(`/api/admin/agents/${agentId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete agent");
            fetchAgents();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete");
        }
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
                            <h1 className="text-xl font-bold text-white">AI Agents</h1>
                            <p className="text-sm text-zinc-400">Manage your AI agent configurations</p>
                        </div>
                        <Link
                            href="/agents/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Agent
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

                {agents.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
                            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No agents configured</h3>
                        <p className="text-zinc-400 mb-6">Create your first AI agent to get started.</p>
                        <Link
                            href="/agents/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Create Agent
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {agents.map((agent) => (
                            <div
                                key={agent._id}
                                className={`bg-zinc-800/50 rounded-lg border ${
                                    agent.isActive ? "border-green-500/50" : "border-zinc-700"
                                } p-6`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                                            {agent.isActive && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                                            {agent.systemPrompt}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                                            <span>Voice: {agent.voice}</span>
                                            <span>Language: {agent.language}</span>
                                            <span>Summary: {agent.summaryLength}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        {!agent.isActive && (
                                            <button
                                                onClick={() => handleSetActive(agent._id)}
                                                className="px-3 py-1.5 text-sm text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                            >
                                                Set Active
                                            </button>
                                        )}
                                        <Link
                                            href={`/agents/${agent._id}`}
                                            className="px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(agent._id)}
                                            className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}