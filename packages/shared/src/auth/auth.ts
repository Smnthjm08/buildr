import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@workspace/db";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "http://localhost:8080"],
  appName: "buildrr",
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  // databaseHooks: {
  //   user: {
  //     create: {
  //       after: async (user) => {
  //         // Create a workspace for the new user
  //         await prisma.workspace.create({
  //           data: {
  //             userId: user.id,
  //             name: `${user.name}`,
  //             slug: `${user.name?.toLowerCase().replace(/\s+/g, '-')}-workspace`,
  //           },
  //         });
  //       },
  //     },
  //   },
  // },

  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      console.log("data", data, request);
      // TODO send an email to user with link to reset password
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const workspace = await prisma.workspace.findFirst({
        where: {
          userId: user?.id,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          userId: true,
        },
      });
      return {
        workspace,
        user,
        session,
      };
    }),
  ],
});
