import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthModal from "@/components/auth/auth-modal";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legacy - Preserve Your Life Stories",
  description:
    "Legacy preserves your life stories through AI-powered phone conversations. Record, transcribe, and archive the moments that matter most.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SiteHeader />
        <div className="fixed top-0 right-0 p-4 z-50">
          <AuthModal />
        </div>
        {children}
        {/* <SiteFooter /> */}
      </body>
    </html>
  );
}
