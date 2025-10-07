import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@repo/db";
// import { jwt } from "better-auth/plugins";

console.log("DATABASE_URL", process.env.DATABASE_URL);

export const auth: any = betterAuth({
  // plugins: [jwt()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: (process.env.BETTER_AUTH_SECRET as string) ?? "secret",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        console.log("GITHUB PROFILE", profile);
        return {
          name: profile.name ?? "null",
          email: profile.email,
          image: profile.avatar_url ?? "null",
          emailVerified: true,
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        console.log("GOOGLE PROFILE", profile);
        return {
          name: profile.name ?? "Not avilable",
          email: profile.email ?? "Not avilable",
          image: profile.picture ?? "Not avilable",
          emailVerified: true,
        };
      },
    },
  },
});
