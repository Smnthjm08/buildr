// TODO res.workspace
import { auth } from "@workspace/shared/auth/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@workspace/db";

export async function GET(_req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id)
      return NextResponse.json({ valid: false }, { status: 401 });

    const workspace = await prisma.workspace.findFirst({
      where: {
        userId: session?.user?.id,
      },
    });

    return NextResponse.json({
      valid: true,
      workspaceSlug: workspace?.slug,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
