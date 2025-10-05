// lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "@/utils/SignInMessage";
import type { NextAuthOptions } from "next-auth";
import prisma from "@repo/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials, req) {
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || "{}"),
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);
          if (signinMessage.domain !== nextAuthUrl.host) return null;

          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });
          if (signinMessage.nonce !== csrfToken) return null;

          const validationResult = await signinMessage.validate(
            credentials?.signature || "",
          );
          if (!validationResult)
            throw new Error("Could not validate the signed message");

          const data = await prisma.user.upsert({
            where: {
              publicKey: signinMessage.publicKey,
            },
            create: {
              publicKey: signinMessage.publicKey,
            },
            update: {},
          });
          return {
            id: data.id,
            publicKey: data.publicKey,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  // adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token }) {
      session.publicKey = token.sub;
      if (session.user) {
        session.user.name = token.sub;
        session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
      }
      return session;
    },
  },
};
