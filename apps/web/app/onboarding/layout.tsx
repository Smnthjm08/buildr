// app/onboarding/layout.tsx
import { getSession } from "@/actions/get-session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Complete Your Profile | Your App Name",
  description: "Complete your profile to get started",
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect to home if not authenticated
  if (!session?.user) {
    redirect("/");
  }

  // Redirect to dashboard if already onboarded
  if (session.user.onboardingCompleted) {
    redirect("/dashboard");
  }

  return <div className="min-h-screen">{children}</div>;
}
