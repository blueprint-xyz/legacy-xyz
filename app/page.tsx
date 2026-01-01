export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
          Blueprint XYZ
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Customer-facing application at blueprint-xyz.com
        </p>
      </main>
    </div>
  );
}
