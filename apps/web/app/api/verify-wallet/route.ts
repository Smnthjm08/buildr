import { NextResponse } from "next/server";
import nacl from "tweetnacl";
import bs58 from "bs58";

export async function POST(req: Request) {
  const { publicKey, message, signature } = await req.json();

  try {
    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(publicKey),
    );

    if (!verified) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // ✅ Optional: update user's walletAddress in DB
    // await prisma.user.update({
    //   where: { id: session.user.id },
    //   data: { walletAddress: publicKey, walletVerified: true },
    // });

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error("Verification failed:", err);
    return NextResponse.json({ valid: false, error: err }, { status: 500 });
  }
}
