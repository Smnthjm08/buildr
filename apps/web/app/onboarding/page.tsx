"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldDescription,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSession } from "@/actions/get-session";
import completeOnboarding from "@/actions/users/update-session-user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import axios from "axios";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  username: string | null;
  walletAddress: string | null;
  bio: string | null;
  onboardingCompleted: boolean;
}

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { publicKey, signMessage, connected } = useWallet();
  const { connection } = useConnection();

  // 1️⃣ Fetch current session user
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getSession();
      if (data?.user) setUser(data.user);
    };
    fetchUserData();
  }, []);

  // 2️⃣ Auto-verify wallet when connected
  useEffect(() => {
    if (connected && publicKey) {
      verifyWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey]);

  const verifyWallet = async () => {
    if (!publicKey || !signMessage) {
      toast.error("Please use a wallet that supports message signing.");
      return;
    }

    try {
      const message = `Verify ownership of this wallet for SolDonut. Timestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);

      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      const res = await axios.post("/api/verify-wallet", {
        publicKey: publicKey.toBase58(),
        message,
        signature: signatureBase58,
      });

      // const res = await fetch("/api/verify-wallet", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     publicKey: publicKey.toBase58(),
      //     message,
      //     signature: signatureBase58,
      //   }),
      // });

      const data = await res.data;
      if (data.valid) {
        toast.success("✅ Wallet verified successfully!");
        setUser((prev) =>
          prev ? { ...prev, walletAddress: publicKey.toBase58() } : prev,
        );
      } else {
        toast.error("❌ Wallet verification failed.");
      }
    } catch (err) {
      console.error("Wallet verification error:", err);
      toast.error("Message signing cancelled or failed.");
    }
  };

  // 4️⃣ Submit onboarding details
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!user.walletAddress) {
      toast.error("Please connect and verify your wallet first.");
      return;
    }

    const result = await completeOnboarding(user);
    if (result.status === "success") {
      router.push("/dashboard");
      toast.success(result.message);
    } else {
      toast.error("Failed to complete onboarding.");
    }
  };

  if (!user) return <p>Loading user...</p>;

  console.log("Current user data:", user, publicKey?.toString(), connection);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Complete Onboarding</FieldLegend>
              <FieldDescription>
                Fill in the details below to finish setting up your account
              </FieldDescription>

              <FieldLabel className="mt-1">Email</FieldLabel>
              <Input value={user.email} disabled />

              <FieldLabel className="mt-1">Name</FieldLabel>
              <Input
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Your name"
                required
              />

              <FieldLabel className="mt-1">Username</FieldLabel>
              <Input
                value={user.username || ""}
                required
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Enter username"
              />

              <FieldLabel className="mt-1">Bio (optional)</FieldLabel>
              <Textarea
                value={user.bio || ""}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="resize-none"
              />

              <FieldLabel className="mt-1">Wallet</FieldLabel>
              <div className="flex flex-col items-start gap-2">
                <Button asChild>
                  <WalletMultiButton />
                </Button>
                {user.walletAddress ? (
                  <p className="text-sm text-green-500">
                    Verified: {user.walletAddress.slice(0, 6)}...
                    {user.walletAddress.slice(-4)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Connect wallet to verify
                  </p>
                )}
              </div>
            </FieldSet>

            <div className="flex justify-end gap-2 mt-1">
              <Button type="submit" disabled={!user.walletAddress}>
                Submit
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
