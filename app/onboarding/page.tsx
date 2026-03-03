import OnboardingWizard from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background font-sans">
            <main className="w-full max-w-3xl py-16 px-6">
                <OnboardingWizard />
            </main>
        </div>
    );
}
