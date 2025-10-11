import { notFound } from "next/navigation";
import prisma from "@repo/db"; // or your Prisma client

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params; // Add await here

  const user = await prisma.userDetails.findUnique({
    where: { username },
  });

  if (!user) return notFound();

  return (
    <main className="mx-auto max-w-3xl py-10 px-4">
      <h1 className="text-3xl font-bold">@{user.username}</h1>
      {user.username && (
        <p className="text-muted-foreground">{user.username}</p>
      )}

      {/* You can add their stats, donations, etc. */}
    </main>
  );
}
