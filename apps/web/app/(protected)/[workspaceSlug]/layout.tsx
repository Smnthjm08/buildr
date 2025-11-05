"use client";

import Navbar from "@/components/navbar";
import { authClient } from "@workspace/shared/auth/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <main>
      <Navbar workspace={{ id: "dbschdc", name: "cdbwjc", slug: "bscbsj" }} />
      <div>{children}</div>
    </main>
  );
}
