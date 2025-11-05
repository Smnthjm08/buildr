import { createAuthClient } from "better-auth/react";

console.log("BETTER_AUTH_URL", process.env.BETTER_AUTH_URL);

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

export const { signUp, signIn, signOut, getSession, useSession } = authClient;
