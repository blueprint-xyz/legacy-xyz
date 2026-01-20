import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/core/auth/jwt";
import connect from "@/core/db/connect-mongo";
import { CallRecord } from "@/core/db/models/call-record";
import CallsList from "./calls-list";

async function getUserCalls() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return null;
    }

    await connect();

    const calls = await CallRecord.find({ userId: payload.userId })
        .sort({ startedAt: -1 })
        .lean();

    // Convert MongoDB documents to plain objects
    return calls.map((call) => ({
        id: call._id.toString(),
        startedAt: call.startedAt?.toISOString() || null,
        endedAt: call.endedAt?.toISOString() || null,
        durationSeconds: call.durationSeconds || null,
        summary: call.summary || null,
        recordingUrl: call.recordingUrl || null,
        fullTranscript: call.fullTranscript || null,
        status: call.status,
    }));
}

export default async function CallsPage() {
    const calls = await getUserCalls();

    if (calls === null) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            href="/"
                            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1 mb-2"
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
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back
                        </Link>
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                            Your Calls
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                            {calls.length} {calls.length === 1 ? "recording" : "recordings"}
                        </p>
                    </div>
                </div>

                {/* Calls List */}
                {calls.length === 0 ? (
                    <div className="text-center py-16">
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
                                    strokeWidth={1.5}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
                            No calls yet
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                            Start your first call to begin preserving your stories.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Start a Call
                        </Link>
                    </div>
                ) : (
                    <CallsList calls={calls} />
                )}
            </div>
        </div>
    );
}