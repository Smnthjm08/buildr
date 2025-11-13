"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Deploy <span className="text-primary">anything</span> in seconds
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Buildrr helps developers instantly deploy and manage projects from
          GitHub — with automated builds, deployments, and logs in one place.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => router.push("/signup")}>
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/login")}
          >
            Log In
          </Button>
        </div>
      </div>
    </section>
  );
}
