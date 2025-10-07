"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Appbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-xl bg-primary ring-2 ring-ring shadow-sm"
            aria-hidden
          />
          <span className="font-bold text-lg tracking-wide">SolDonut</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/connect-wallet"
            className="px-3 py-2 rounded-lg hover:bg-muted"
          >
            Onboard
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded-lg hover:bg-muted"
          >
            Dashboard
          </Link>
          <Link
            href="/creator/sprinkle"
            className="px-3 py-2 rounded-lg hover:bg-muted"
          >
            Sample Creator
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/signup">Start Creating</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
