"use client";

import { axiosInstance } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ConnectGithubPage() {
  const searchParams = useSearchParams();

  const installationId = searchParams.get("installation_id");
  const setupAction = searchParams.get("setup_action");

  useEffect(() => {
    if (!installationId) return; // wait for param to be available

    const createInstallation = async () => {
      try {
        const res = await axiosInstance.post("/github/connect", {
          installationId,
          setupAction,
        });
        console.log("data", res.data);
      } catch (error) {
        console.error("Error connecting GitHub:", error);
      }
    };

    createInstallation();
  }, [installationId, setupAction]); // ✅ run when params are ready

  return (
    <main className="p-4 bg-red-300">
      <h1>Connect GitHub</h1>
      <p>Installation ID: {installationId}</p>
      <p>Setup Action: {setupAction}</p>
    </main>
  );
}
