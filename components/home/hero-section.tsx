import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
          AI-Powered Life Story Preservation
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] text-balance font-sans">
          Every life tells
          <br />
          a story worth keeping
        </h1>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
          Legacy calls you on the phone, asks thoughtful questions about your
          life, and preserves your answers forever. No apps to learn. No
          screens to stare at. Just a conversation.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#get-started"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-foreground text-background text-sm font-medium rounded-full transition-opacity hover:opacity-90"
          >
            Start Preserving Your Story
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-foreground text-sm font-medium rounded-full transition-colors hover:bg-muted"
          >
            See How It Works
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-semibold text-foreground">6</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
              Min per call
            </p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              100%
            </p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
              Private & Secure
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              {"Forever"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
              Preserved
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
