"use server";

import { User } from "@/app/onboarding/page";
import prisma from "@repo/db";
import { getSession } from "../get-session";

export default async function completeOnboarding(data: User) {
  const session = await getSession();

  if (!session?.user) {
    return { status: "error", message: "User not authenticated." };
  }

  if (!data.username || !data.walletAddress || !data.bio) {
    return { status: "error", message: "All fields are required." };
  }

  const user = await prisma.userDetails.create({
    data: {
      username: data.username,
      walletAddress: data.walletAddress,
      isUsernameEdited: false,
      bio: data.bio,
      onboardingCompleted: true,
      user: {
        connect: { id: session.user.id },
      },
    },
  });

  return { status: "success", message: "User Onboarding Complete.", user };
}
