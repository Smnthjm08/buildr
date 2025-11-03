"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <div>
          {`NODE_ENV: ${process.env.NODE_ENV} | BACKEND_PORT: ${process.env.NEXT_PUBLIC_BACKEND_PORT}`}
        </div>
        <Button onClick={() => router.push("/login")} size="sm">
          Login
        </Button>
        <Button onClick={() => router.push("/signup")} variant={"secondary"}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
