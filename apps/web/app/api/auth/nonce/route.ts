// api/auth/nonce/route.ts 
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { nonces } from "@/lib/nonce";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    const nonce = randomBytes(16).toString("hex");

    nonces.set(walletAddress, nonce);

    return NextResponse.json({ nonce });
  } catch (err) {
    return NextResponse.json({ message: "Failed to generate nonce", error: err }, { status: 500 });
  }
}
