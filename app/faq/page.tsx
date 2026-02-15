import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/layout/site-footer";
import FaqAccordion from "@/components/faq/faq-accordion";

export const metadata: Metadata = {
  title: "FAQ - Legacy",
  description:
    "Frequently asked questions about Legacy. Learn about pricing, privacy, how calls work, and more.",
};

const faqCategories = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What exactly is Legacy?",
        answer:
          "Legacy is an AI-powered service that calls you on the phone and interviews you about your life. Each conversation is recorded, transcribed, and archived to create a permanent record of your stories. Think of it as an oral history project, made effortless.",
      },
      {
        question: "Do I need to download an app?",
        answer:
          "No. Legacy works entirely through phone calls. You sign up on our website, add your phone number, and we call you. There is nothing to download, install, or learn. If you can answer a phone call, you can use Legacy.",
      },
      {
        question: "How long does each call last?",
        answer:
          "Each call is approximately six minutes. We designed them to be short enough to fit into any schedule but long enough to capture meaningful stories. Over time, these short conversations add up to a rich, detailed archive.",
      },
      {
        question: "Who is Legacy for?",
        answer:
          "Legacy is for anyone who wants to preserve their life stories or the stories of someone they love. Many of our users sign up parents, grandparents, or other family members. It is especially useful for people who are not comfortable with technology since it only requires a phone call.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        question: "Who can access my recordings?",
        answer:
          "Only you can access your recordings by default. You control who sees your stories. We use enterprise-grade encryption to protect your data both in transit and at rest. We never sell, share, or use your personal stories for any purpose other than providing this service to you.",
      },
      {
        question: "Can I delete my recordings?",
        answer:
          "Yes. You have full control over your data. You can delete individual recordings or your entire account at any time. When you delete something, it is permanently removed from our systems.",
      },
      {
        question: "Is my phone number safe?",
        answer:
          "Absolutely. Your phone number is used solely for making Legacy calls. We never share it with third parties, use it for marketing, or sell it. It is stored securely with the same encryption we use for all personal data.",
      },
    ],
  },
  {
    category: "How Calls Work",
    questions: [
      {
        question: "What kind of questions does Legacy ask?",
        answer:
          "Legacy asks open-ended, thoughtful questions about your life. Topics range from childhood memories and family traditions to career milestones and personal reflections. The AI adapts its questions based on your previous conversations, so each call builds on the last and explores new territory.",
      },
      {
        question: "Can I choose what topics to talk about?",
        answer:
          "Yes. While Legacy will suggest topics, you are always in control of the conversation. You can steer the discussion to whatever subject matters most to you. If a question does not resonate, just say so, and Legacy will move on.",
      },
      {
        question: "What happens if I miss a call?",
        answer:
          "Nothing bad. Legacy will try again at your next scheduled time. There is no penalty for missing a call. Life happens, and we designed the system to be flexible and forgiving.",
      },
      {
        question: "Can I schedule when Legacy calls me?",
        answer:
          "Scheduling features are coming soon. Currently, you can initiate a call whenever you are ready from your dashboard. We are building a full scheduling system so you can set recurring call times that work with your routine.",
      },
    ],
  },
  {
    category: "Your Archive",
    questions: [
      {
        question: "How do I access my recorded stories?",
        answer:
          "All your recordings, transcripts, and summaries are available in your personal dashboard on the Legacy website. You can listen to audio recordings, read transcripts, and browse AI-generated summaries of each conversation.",
      },
      {
        question: "Can I share my stories with family?",
        answer:
          "We are building family sharing features that will let you invite family members to listen to your stories. For now, you are the only person with access to your archive. Sharing controls are a top priority on our roadmap.",
      },
      {
        question: "What format are the recordings in?",
        answer:
          "Audio recordings are saved in high-quality MP3 format. Transcripts are available as text. Both can be accessed through your dashboard anytime.",
      },
    ],
  },
  {
    category: "Pricing",
    questions: [
      {
        question: "How much does Legacy cost?",
        answer:
          "Your first three calls are completely free with no credit card required. This lets you experience Legacy and decide if it is right for you before committing. Pricing for ongoing subscriptions will be announced soon.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "Yes. Every new account gets three free calls. There is no time limit on using them, so you can try Legacy at your own pace. No credit card is required to sign up.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Hero */}
      <section className="px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Support
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] text-balance">
            Frequently asked
            <br className="hidden md:block" /> questions
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Everything you need to know about Legacy. If you can{"'"}t find
            what you{"'"}re looking for, feel free to reach out.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-12">
            {faqCategories.map((category) => (
              <div key={category.category}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
                  {category.category}
                </h2>
                <FaqAccordion questions={category.questions} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <div className="mx-auto max-w-6xl px-6">
        <hr className="border-border" />
      </div>
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Still have questions?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We{"'"}d love to hear from you. Reach out and we{"'"}ll get back
            to you as soon as possible.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-foreground text-background text-sm font-medium rounded-full transition-opacity hover:opacity-90"
            >
              Get Started for Free
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-foreground text-sm font-medium rounded-full transition-colors hover:bg-muted"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
