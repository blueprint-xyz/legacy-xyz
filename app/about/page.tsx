import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works - Legacy",
  description:
    "Learn how Legacy preserves your life stories through simple AI-powered phone conversations. No apps, no screens, just your voice.",
};

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up with your email and add the phone number where you'd like to receive calls. It takes under a minute.",
    detail:
      "We only need the basics. Your phone number is how Legacy reaches you, and your email is how you access your story archive.",
  },
  {
    number: "02",
    title: "Receive a call",
    description:
      "Legacy calls you at a time you choose. Pick up the phone and start talking. No apps to open, no buttons to press.",
    detail:
      "Each call lasts about six minutes. Our AI interviewer greets you by name and picks up where you left off from your last conversation.",
  },
  {
    number: "03",
    title: "Have a conversation",
    description:
      "Our AI asks thoughtful questions about your life. It listens, follows up, and guides the conversation naturally.",
    detail:
      "From childhood memories to career milestones to family traditions, Legacy asks questions designed to surface the stories that matter most to you.",
  },
  {
    number: "04",
    title: "Your stories are preserved",
    description:
      "Every call is recorded, transcribed, and archived. Listen back anytime or share with family members.",
    detail:
      "You get a high-quality audio recording, a word-for-word transcript, and an AI-generated summary of each conversation. All stored securely in your personal archive.",
  },
];

const principles = [
  {
    title: "Privacy first",
    description:
      "Your stories are yours. We use enterprise-grade encryption and never sell or share your data. You control who has access.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    title: "Built for everyone",
    description:
      "No technical knowledge required. If you can answer a phone call, you can use Legacy. Designed especially for people who aren't comfortable with technology.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
  },
  {
    title: "Conversations that improve",
    description:
      "The more you talk, the better Legacy gets at asking questions that matter to you. Each call builds on the last.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Hero */}
      <section className="px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
            How It Works
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] text-balance">
            Four steps between you
            <br className="hidden md:block" /> and a preserved legacy
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Legacy is designed to be the easiest way to capture life stories.
            No downloads, no complicated setup. Just your phone and your voice.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-0">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex gap-8 pb-16 last:pb-0"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />
                )}

                {/* Step number */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold font-mono">
                    {step.number}
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <hr className="border-border" />
      </div>

      {/* Principles */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Our Principles
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              Built with care, for people
              <br className="hidden md:block" /> who care about their stories
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="p-8 rounded-2xl border border-border bg-card"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground mb-5">
                  {principle.icon}
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {principle.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Ready to start preserving
            <br className="hidden md:block" /> your family{"'"}s stories?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Your first three calls are free. No credit card required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-foreground text-background text-sm font-medium rounded-full transition-opacity hover:opacity-90"
            >
              Get Started for Free
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-foreground text-sm font-medium rounded-full transition-colors hover:bg-muted"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
