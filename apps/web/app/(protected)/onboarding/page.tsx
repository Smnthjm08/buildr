import { redirect } from "next/navigation";
import { auth } from "@workspace/shared/auth/server";
import prisma from "@workspace/db";
import OnboardingForm from "@/components/onboarding-form";
import { headers } from "next/headers";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const workspace = await prisma.workspace.findFirst({
    where: { userId: session.user.id },
    select: { slug: true },
  });

  if (workspace) {
    redirect(`/${workspace.slug}/`);
  }

  return <OnboardingForm />;
}
