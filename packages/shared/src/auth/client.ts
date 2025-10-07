import { createAuthClient } from "better-auth/react";
// import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // plugins: [
  //   jwtClient() 
  // ],
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3004",
});
