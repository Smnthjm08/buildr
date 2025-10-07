// onboarding/page.tsx
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

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  username: string | null;
  walletAddress: string | null;
  bio: string | null;
  onboardingCompleted: boolean;
}

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getSession();
      if (data?.user) setUser(data.user);
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting user info:", user);
    if (user) {
      const test = await completeOnboarding(user);
      console.log("Update result:", test);
      if (test.status === "success") {
        toast.success(test.message);
        router.push("/dashboard");
      }
    }
  };

  if (!user) return <p>Loading user...</p>;

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

              <FieldLabel className="mt-2">Email</FieldLabel>
              <Input value={user.email} disabled />

              <FieldLabel className="mt-2">Name</FieldLabel>
              <Input
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Your name"
                required
              />

              <FieldLabel className="mt-2">Username</FieldLabel>
              <Input
                value={user.username || ""}
                required
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Enter username"
              />

              <FieldLabel className="mt-2">Wallet Address</FieldLabel>
              <Input
                value={user.walletAddress || ""}
                onChange={(e) =>
                  setUser({ ...user, walletAddress: e.target.value })
                }
                placeholder="Connect your wallet"
              />

              <FieldLabel className="mt-2">Bio (optional)</FieldLabel>
              <Textarea
                value={user.bio || ""}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="resize-none"
              />
            </FieldSet>

            <div className="flex gap-2 mt-4">
              <Button type="submit">Submit</Button>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
