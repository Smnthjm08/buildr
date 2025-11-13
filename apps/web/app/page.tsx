"use client";

import FeaturesSection from "@/components/home/features";
import FooterSection from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FooterSection />
    </main>
  );
}
