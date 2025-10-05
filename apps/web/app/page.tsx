"use client";

import { useEffect } from "react";
import { getUsers } from "../actions/users";
import Hero from "@/components/hero";
import { Appbar } from "@/components/appbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  
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
    <main>
      <Appbar />
      <Hero />
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Fast onboarding</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Create your page in minutes and share a sweet link with your fans.
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Sweet experiences</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              A playful tipping flow with celebratory confetti and friendly UI.
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Creator-first</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Clear stats and donor messages that brighten your day.
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
