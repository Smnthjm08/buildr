import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-5">
          <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground ring-1 ring-ring">
            Web3 tips on Solana
          </span>
          <h1 className="text-balance text-4xl md:text-6xl font-extrabold leading-tight">
            Sprinkle kindness. Send donuts.
          </h1>
          <p className="text-pretty text-muted-foreground md:text-lg">
            SolDonut makes tipping your favorite creators fun, fast, and
            frosting-sweet. Create a page, share your link, and let the donuts
            roll in.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/connect-wallet">Create my page</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-full"
            >
              <Link href="/creator/sprinkle">See a demo</Link>
            </Button>
          </div>
          <div className="flex gap-2 pt-2 text-sm text-muted-foreground">
            <span className="rounded-full bg-muted px-3 py-1">
              No wallet? View-only demo
            </span>
            <span className="rounded-full bg-muted px-3 py-1">
              Pastel. Playful. Friendly.
            </span>
          </div>
        </div>

        <Card className="rounded-3xl shadow-lg border bg-card/70 backdrop-blur">
          <CardContent className="p-6">
            <div className="aspect-video w-full rounded-2xl bg-muted grid place-items-center">
              <Image
                width={192}
                height={192}
                src="/hero.jpg"
                alt="A pink frosted donut with sprinkles"
                className="h-48 w-48 object-contain"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-accent px-3 py-3">
                <div className="text-2xl font-bold">0.1s</div>
                <div className="text-xs text-accent-foreground/80">
                  Snappy UI
                </div>
              </div>
              <div className="rounded-xl bg-primary/20 px-3 py-3">
                <div className="text-2xl font-bold">SOL</div>
                <div className="text-xs text-foreground/70">Native tips</div>
              </div>
              <div className="rounded-xl bg-secondary/40 px-3 py-3">
                <div className="text-2xl font-bold">❤️</div>
                <div className="text-xs text-foreground/70">Fans first</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-[radial-gradient(circle_at_50%_120%,rgba(246,212,139,0.6),transparent_70%)]" /> */}
      {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_50%_-20%,rgba(185,230,211,0.5),transparent_70%)]" /> */}
    </section>
  );
}
