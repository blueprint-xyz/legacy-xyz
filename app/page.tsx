import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import TestimonialSection from "@/components/home/testimonial-section";
import CtaSection from "@/components/home/cta-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <HeroSection />
      <div className="mx-auto max-w-6xl px-6">
        <hr className="border-border" />
      </div>
      <FeaturesSection />
      <TestimonialSection />
      <div className="mx-auto max-w-6xl px-6">
        <hr className="border-border" />
      </div>
      <CtaSection />
    </main>
  );
}
