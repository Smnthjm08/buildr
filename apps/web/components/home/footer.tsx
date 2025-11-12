"use client";

import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="border-t border-border py-4">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">Buildrr</span>. Built
          by developers, for developers.
        </p>

        <Link
          href="https://github.com/smnthjm08/buildrr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <GithubIcon className="h-5 w-5" />
          <span>View on GitHub</span>
        </Link>
      </div>
    </footer>
  );
}
