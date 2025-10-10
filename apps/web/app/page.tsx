"use client";

import Hero from "@/components/hero";
import { Appbar } from "@/components/appbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FooterSection from "@/components/footer";
import FAQSection from "@/components/faq-section";

export default function LandingPage() {
  console.log("RENDERING LANDING PAGE", process.env.NEXT_PUBLIC_NODE_ENV);
  console.log("RENDERING LANDING PAGE", process.env.BETTER_AUTH_SECRET);

  return (
    <main>
      <Appbar />
      <Hero />
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Fast onboarding</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Create your page in minutes and share a sweet link with your fans.
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Sweet experiences</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              A playful tipping flow with celebratory confetti and friendly UI.
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Creator-first</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Clear stats and donor messages that brighten your day.
            </CardContent>
          </Card>
        </div>
      </section>

      <FAQSection />

      <FooterSection />
    </main>
  );
}
