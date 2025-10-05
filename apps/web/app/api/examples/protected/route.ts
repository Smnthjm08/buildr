import prisma from "@repo/db";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET! as string;

export async function GET(req: NextApiRequest) {
  const token = await getToken({ req, secret });

  if (!token || !token.sub) {
    return new Response(
      JSON.stringify({ error: "User wallet not authenticated" }),
      { status: 401 },
    );
  }

  const users = await prisma.user.findMany();

  return new Response(
    JSON.stringify({
      content:
        "This is protected content. You can access this content because you are signed in with your Solana Wallet.",
      data: users,
    }),
    { status: 200 },
  );
}
