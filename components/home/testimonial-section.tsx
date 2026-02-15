export default function TestimonialSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="relative bg-card border border-border rounded-3xl p-10 md:p-16 text-center">
          <svg
            className="w-10 h-10 text-accent mx-auto mb-8 opacity-60"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
          </svg>
          <blockquote className="text-xl md:text-2xl font-medium text-card-foreground leading-relaxed text-pretty">
            I never thought I{"'"}d hear my grandmother{"'"}s voice tell me about
            her childhood. Legacy made it possible with just a phone call.
            These recordings are the most precious thing our family owns.
          </blockquote>
          <div className="mt-8">
            <p className="text-sm font-semibold text-card-foreground">
              Sarah M.
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Preserving her grandmother{"'"}s stories
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
