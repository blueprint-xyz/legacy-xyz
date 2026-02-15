import Dashboard from "@/components/dashboard/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans pt-16">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-16 px-6">
        <Dashboard />
      </main>
    </div>
  );
}
