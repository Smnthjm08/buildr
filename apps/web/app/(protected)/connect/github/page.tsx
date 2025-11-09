"use client";

import { axiosInstance } from "@/utils/axios";
import { useSession } from "@workspace/shared/auth/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function ConnectGithubPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const installationId = searchParams.get("installation_id");
  const setupAction = searchParams.get("setup_action");

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (!installationId || isPending || !session?.workspace) return;

    hasRun.current = true;

    const connectInstallation = async () => {
      try {
        const res = await axiosInstance.post("/github/connect", {
          installationId,
          setupAction,
        });

        if (res.status === 200) {
          toast.success("GitHub connected successfully!");
          if (session?.workspace) {
            router.replace(`/${session.workspace.slug}`);
          }
        }
      } catch (error) {
        console.error("Error connecting GitHub:", error);
        toast.error("Failed to connect GitHub. Try again.");
      }
    };

    connectInstallation();
  }, [installationId, isPending, session]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-muted-foreground">
      <p className="animate-pulse">Connecting GitHub...</p>
    </main>
  );
}
