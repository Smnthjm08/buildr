"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface dataType {
  nonce: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { publicKey, signMessage, connected } = useWallet();

  console.log("publicKey:", publicKey?.toBase58());
  console.log("connected:", connected);
  console.log("signMessage available:", !!signMessage);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function authenticateWallet() {
      if (!publicKey || !connected || isAuthenticating) return;

      // Check if wallet supports message signing
      if (!signMessage) {
        setAuthError(
          "This wallet doesn't support message signing. Please use a different wallet."
        );
        console.error("Wallet does not support message signing");
        return;
      }

      setIsAuthenticating(true);
      setAuthError(null);

      try {
        const walletAddress = publicKey.toBase58();

        // Step 1: Get nonce from server
        console.log("Requesting nonce for:", walletAddress);
        const nonceRes = await fetch("/api/auth/nonce", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress }),
        });

        if (!nonceRes.ok) {
          const errorData = await nonceRes.json();
          throw new Error(errorData.error || "Failed to get nonce");
        }

        const data: dataType = await nonceRes.json();
        console.log("Received nonce:", data.nonce);

        // Step 2: Sign the message
        // const message = `Sign this message to authenticate with sol-donut.\n\nNonce: ${data.nonce}`;
        // const encodedMessage = new TextEncoder().encode(message);

        console.log("Requesting signature...");
        // const signature = await signMessage(encodedMessage);
        console.log("Message signed successfully");

        // Step 3: Verify signature on server
        console.log("Verifying signature...");
        const message = `Sign this message to authenticate with sol-donut.\n\nNonce: ${data.nonce}`;
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await signMessage(encodedMessage);

        const verifyRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress,
            signature: Array.from(signature),
            nonce: data.nonce, // no need to send `message`
          }),
        });

        if (!verifyRes.ok) {
          const errorData = await verifyRes.json();
          throw new Error(errorData.error || "Verification failed");
        }

        const verifyData = await verifyRes.json();
        console.log("✅ Authentication successful:", verifyData);
        setAuthError(null);
      } catch (err: any) {
        console.error("❌ Error during authentication:", err);

        // Handle specific error types
        if (err.message?.includes("User rejected")) {
          setAuthError("You rejected the signature request. Please try again.");
        } else {
          setAuthError(err.message || "Authentication failed");
        }
      } finally {
        setIsAuthenticating(false);
      }
    }

    if (connected && !isAuthenticating) {
      authenticateWallet();
    }
  }, [connected, publicKey, signMessage, isAuthenticating]);

  return (
    <div className="flex-col flex items-center min-h-screen gap-2 justify-center">
      <div className="font-extrabold text-7xl text-blue-300">sol-donut.</div>

      {mounted && <WalletMultiButton />}

      {isAuthenticating && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
          <p className="text-sm text-muted-foreground">
            Authenticating wallet...
          </p>
        </div>
      )}

      {authError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md max-w-md">
          <p className="text-sm text-red-600">{authError}</p>
        </div>
      )}

      {connected && publicKey && !isAuthenticating && !authError && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">
            ✅ Connected: {publicKey.toBase58().slice(0, 4)}...
            {publicKey.toBase58().slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
}
