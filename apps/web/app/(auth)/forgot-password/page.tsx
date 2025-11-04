// TODO: Implement forgot password functionality
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  return (
    <main className="font-semibold text-4xl flex flex-col">
      Forgot Password Page
      <Button onClick={() => router.back()}>Go Back</Button>
    </main>
  );
}
