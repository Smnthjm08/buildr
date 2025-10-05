// api/auth/verify/route.ts
import { NextResponse } from "next/server";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { getNonce, clearNonce } from "@/lib/nonce";

export async function POST(req: Request) {
  try {
    const { walletAddress, signature, nonce } = await req.json();

    if (!walletAddress || !signature || !nonce) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const storedNonce = getNonce(walletAddress);
    console.log("Stored nonce:", storedNonce);
    console.log("Received nonce:", nonce);

    // const storedNonce = getNonce(walletAddress);
    if (storedNonce !== nonce) {
      return NextResponse.json(
        { error: "Invalid or expired nonce" },
        { status: 400 }
      );
    }

    // Verify signature
    // const isValid = nacl.sign.detached.verify(
    //   new TextEncoder().encode(nonce),
    //   new Uint8Array(signature),
    //   bs58.decode(walletAddress)
    // );
    const message = `Sign this message to authenticate with sol-donut.\n\nNonce: ${nonce}`;
    const isValid = nacl.sign.detached.verify(
      new TextEncoder().encode(message), // Exactly the signed message
      new Uint8Array(signature), // Signature bytes as Uint8Array
      bs58.decode(walletAddress) // Public key bytes
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Clear nonce so it can't be reused
    clearNonce(walletAddress);

    // ✅ Optionally save wallet/user in DB here using Prisma
    // e.g., await prisma.user.upsert({ ... })

    return NextResponse.json({ success: true, message: "Wallet verified!" });
  } catch (err) {
    return NextResponse.json(
      { error: "Verification failed", details: err },
      { status: 500 }
    );
  }
}
