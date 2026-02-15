"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "@/components/auth/auth-modal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Close drawer on route change
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-background"
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
              <span className="text-lg font-semibold tracking-tight text-foreground font-sans">
                Legacy
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Auth on desktop only */}
            <div className="hidden md:block">
              <AuthModal />
            </div>
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
          onClick={closeDrawer}
          aria-label="Close navigation menu"
        />

        {/* Drawer Panel */}
        <nav
          className={`absolute top-0 right-0 h-full w-72 bg-background border-l border-border shadow-lg flex flex-col transition-transform duration-300 ease-in-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <span className="text-lg font-semibold tracking-tight text-foreground font-sans">
              Menu
            </span>
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors"
              onClick={closeDrawer}
              aria-label="Close navigation menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth in mobile drawer */}
          <div className="mt-auto border-t border-border px-4 py-4">
            <AuthModal />
          </div>
        </nav>
      </div>
    </>
  );
}
