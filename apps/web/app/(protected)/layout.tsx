// "use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
// import { getSession } from "@/actions/get-session";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // const router = useRouter();

  // async function checkAuth() {
  //   const data = await getSession();
  //   if (!data?.user) {
  //     router.push("/onboarding");
  //   }
  //   if (data?.user && !data.user.onboardingCompleted) {
  //     router.push("/onboarding");
  //   }
  // }

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger disabled />
        {children}
      </main>
    </SidebarProvider>
  );
}
