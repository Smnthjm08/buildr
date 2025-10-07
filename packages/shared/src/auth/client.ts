import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
// import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3004",
});
