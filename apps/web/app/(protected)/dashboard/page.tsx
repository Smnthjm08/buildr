"use client";
import { useSession } from "@workspace/shared/auth/client";

export default function DashboardPage() {
  const { data } = useSession();

  console.log("Dashboard session data:", data);

  return (
    <main className="flex flex-col min-h-svh justify-center items-center gap-4">
      <div className="font-sans font-bold text-2xl">Dashboard Page</div>
    </main>
  );
}
