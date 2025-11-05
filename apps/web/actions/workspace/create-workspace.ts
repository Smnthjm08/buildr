"use server";

import prisma from "@workspace/db";
import { auth } from "@workspace/shared/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createWorkspace(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/");

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase();

  if (!name || !slug) {
    throw new Error("Workspace name and slug are required.");
  }

  try {
    const existing = await prisma.workspace.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new Error("That workspace slug is already taken.");
    }

    // ✅ Create workspace
    await prisma.workspace.create({
      data: {
        name,
        slug,
        userId: session.user.id,
      },
    });

    // Redirect to the workspace slug instead of /dashboard
    redirect(`/${slug}`);
  } catch (err: any) {
    // ✅ Handle race condition or Prisma error (backup safety)
    if (err.code === "P2002") {
      throw new Error("That workspace slug is already taken.");
    }
    console.error("Error creating workspace:", err);
    throw new Error("Failed to create workspace. Please try again.");
  }
}