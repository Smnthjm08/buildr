"use client";

import Navbar from "@/components/navbar";
import { useSession } from "@workspace/shared/auth/client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WorkSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { workspaceSlug } = useParams();
  const { data: session, isPending } = useSession();

  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/");
      return;
    }

    const loadWorkspace = async () => {
      const res = await fetch("/api/workspace/me");
      const data = await res.json();

      if (!data.workspace) {
        router.replace("/onboarding");
        return;
      }

      setWorkspace(data.workspace);

      // enforce correct slug
      if (workspaceSlug !== data.workspace.slug) {
        router.replace(`/${data.workspace.slug}/`);
      }

      setLoading(false);
    };

    loadWorkspace();
  }, [session, isPending, router, workspaceSlug]);

  if (loading) return null;

  const showContent = workspaceSlug === workspace?.slug;

  return (
    <main className="min-h-svh">
      {showContent && <Navbar workspace={workspace} />}

      <div className="w-full flex justify-center">
        {showContent && children}
      </div>
    </main>
  );
}
