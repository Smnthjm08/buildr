"use server";

import prisma from "@workspace/db";

export async function getGitHubToken(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, providerId: "github" },
  });

  return account?.accessToken;
}
