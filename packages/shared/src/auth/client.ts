import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
  baseURL: "http://localhost:3004",
  fetchOptions: {
    credentials: "include",
  },
});

export type Session = typeof authClient.$Infer.Session;
