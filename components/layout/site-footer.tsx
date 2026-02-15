import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-background"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <span className="text-base font-semibold tracking-tight text-foreground font-sans">
                Legacy
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Preserving the stories that matter most. Every voice carries a
              lifetime of wisdom, laughter, and love worth keeping.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Navigate
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-foreground hover:text-accent transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-foreground hover:text-accent transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-foreground hover:text-accent transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Account
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="/calls"
                    className="text-sm text-foreground hover:text-accent transition-colors"
                  >
                    Your Calls
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Legacy. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Every story deserves to be remembered.
          </p>
        </div>
      </div>
    </footer>
  );
}
