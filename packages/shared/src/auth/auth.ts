import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@repo/db";
import { customSession } from "better-auth/plugins";

// @ts-ignore
export const auth = betterAuth({
  plugins: [
    customSession(async ({ user, session }) => {
      const userDetail = await prisma.userDetails.findUnique({
        where: {
          userId: user?.id,
        },
      });

      return {
        session,
        user: {
          ...user,
          walletAddress: userDetail?.walletAddress ?? null,
          username: userDetail?.username ?? null,
          bio: userDetail?.bio ?? null,
          onboardingCompleted: userDetail?.onboardingCompleted ?? false,
        },
      };
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET ?? "secret",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => ({
        name: profile.name ?? "null",
        email: profile.email,
        image: profile.avatar_url ?? "null",
        emailVerified: true,
      }),
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => ({
        name: profile.name ?? "Not available",
        email: profile.email ?? "Not available",
        image: profile.picture ?? "Not available",
        emailVerified: true,
      }),
    },
  },
});

// Export the type for client-side inference
export type Auth = typeof auth;
