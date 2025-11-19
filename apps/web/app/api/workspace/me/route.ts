import prisma from "@workspace/db";
import { auth } from "@workspace/shared/auth/server";
import { NextResponse } from "next/server";
import { fromNodeHeaders } from "better-auth/node";
import { headers } from "next/headers";

export async function GET() {
  const nodeHeaders = fromNodeHeaders(Object.fromEntries(await headers()));

  const session = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: nodeHeaders,
  });

  if (!session) {
    return NextResponse.json({ workspace: null });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { userId: session.user.id },
    select: { id: true, slug: true, name: true },
  });

  return NextResponse.json({ workspace });
}
