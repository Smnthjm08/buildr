"use client";

import Navbar from "@/components/navbar";
import { useSession } from "@workspace/shared/auth/client";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

// const NON_WORKSPACE_ROUTES = ["/connect-github", "/logout"];

export default function WorkSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { workspaceSlug } = useParams() as { workspaceSlug?: string };
  const { data: session, isPending } = useSession();


  useEffect(() => {
    if (isPending) return;

    // const currentPath = window.location.pathname;

    // if (NON_WORKSPACE_ROUTES.some((route) => currentPath.startsWith(route))) {
    //   return; // Do NOT enforce workspace slug here
    // }

    if (!session) {
      router.replace("/");
      return;
    }

    if (!session.workspace) {
      router.replace("/onboarding");
      return;
    }

    const userSlug = session.workspace.slug;

    if (workspaceSlug && workspaceSlug !== userSlug) {
      router.replace(`/${userSlug}/`);
    }
  }, [session, isPending, router, workspaceSlug]);

  const showContent =
    !!session?.workspace && workspaceSlug === session?.workspace.slug;

  return (
    <main className="min-h-svh">
      {session?.workspace && workspaceSlug === session.workspace.slug && (
        <Navbar workspace={session.workspace} />
      )}

      <div className="w-full flex justify-center">
        {showContent &&
          children
          // ) : (
          // <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
          // <LoaderIcon className="h-5 w-5 animate-spin" />
          // <p className="text-sm">Loading workspace...</p>
          // </div>
        }
      </div>
    </main>
  );
}
