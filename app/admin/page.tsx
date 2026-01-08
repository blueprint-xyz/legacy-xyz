"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserWithStats {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
    callCount: number;
    lastCallAt: string | null;
}

export default function AdminPage() {
    const [users, setUsers] = useState<UserWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("/api/admin/users");
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                setUsers(data.users);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-zinc-900">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-sm text-zinc-400">Legacy XYZ Management</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-white">Users</h2>
                    <p className="text-sm text-zinc-400">
                        {users.length} registered user{users.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                        {error}
                    </div>
                )}

                {!loading && !error && users.length === 0 && (
                    <div className="text-center py-12 text-zinc-400">
                        No users found
                    </div>
                )}

                {!loading && !error && users.length > 0 && (
                    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-700">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Calls
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Last Call
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-700">
                                {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-white">
                                                    {user.fullName}
                                                </div>
                                                <div className="text-sm text-zinc-400">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-300">
                                            {user.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                                {user.callCount} call{user.callCount !== 1 ? "s" : ""}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-400">
                                            {formatDate(user.lastCallAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-400">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/users/${user._id}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}