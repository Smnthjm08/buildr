"use server";

import { auth } from "@workspace/shared/auth/server";
import { headers } from "next/headers";
import prisma from "@workspace/db";

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session ?? null;
}

export async function getUserWorkspace(userId: string) {
  return await prisma.workspace.findFirst({
    where: { userId },
  });
}
