import OnboardingForm from "@/components/onboarding/onboarding-form";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-16 px-6 bg-white dark:bg-black">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Legacy XYZ
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Preserve your story with AI-powered phone interviews
          </p>
        </div>
        <OnboardingForm />
      </main>
    </div>
  );
}
