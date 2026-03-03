import Link from "next/link";

export default function CtaSection() {
  return (
    <section id="get-started" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Get Started
        </p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
          Your story is waiting
          <br className="hidden md:block" /> to be told
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
          Create a free account, add your phone number, and receive your first
          call. It takes less than two minutes to begin.
        </p>
        <div className="mt-10">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center justify-center px-10 py-4 bg-foreground text-background text-sm font-medium rounded-full transition-opacity hover:opacity-90"
          >
            Create Your Free Account
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required. Your first three calls are free.
        </p>
      </div>
    </section>
  );
}
