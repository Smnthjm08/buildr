"use client";

import { authClient } from "@repo/shared/client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending, data, error } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && data?.user && !error) {
      router.push("/onboarding");
    }
  }, [isPending, data, error, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" />{" "}
      </div>
    );
  }

  return (
    <div className="flex items-center flex-row min-h-screen justify-center">
      <div>{children}</div>
    </div>
  );
}