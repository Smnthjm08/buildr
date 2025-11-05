"use server";

import prisma from "@workspace/db";
import { auth } from "@workspace/shared/auth/server";
import { headers } from "next/headers";

export async function getUserWorkspace() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const workspace = await prisma.workspace.findUnique({
    where: { userId: session.user.id },
    select: { slug: true },
  });

  return workspace;
}
