const awards = [
  {
    title: "Best AI Innovation",
    year: "2025",
    organization: "TechCrunch Disrupt",
    description:
      "Recognized for pioneering the use of conversational AI to preserve personal histories at scale.",
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
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    ),
  },
  {
    title: "Design Excellence",
    year: "2024",
    organization: "Webby Awards",
    description:
      "Honored for creating an interface so simple that technology disappears, leaving only human connection.",
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
          d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0"
        />
      </svg>
    ),
  },
  {
    title: "Social Impact Award",
    year: "2024",
    organization: "Fast Company",
    description:
      "Selected among the world's most innovative companies for making life story preservation accessible to everyone.",
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
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
  },
];

export default function TestingWithNetanel() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Internal Testing
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] text-balance font-sans">
            Testing with Netanel
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            A dedicated space for testing, experimenting, and iterating on new
            ideas before they go live.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <hr className="border-border" />
      </div>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Recognition
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              Awards & honors
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {awards.map((award) => (
              <div
                key={award.title}
                className="group p-8 rounded-2xl border border-border bg-card transition-colors hover:border-accent/50"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground mb-5">
                  {award.icon}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  {award.organization} &middot; {award.year}
                </p>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {award.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {award.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
