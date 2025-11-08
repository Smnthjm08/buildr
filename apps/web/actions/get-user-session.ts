"use server";

import { auth } from "@workspace/shared/auth/server";
import { headers } from "next/headers";

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session ?? null;
}

