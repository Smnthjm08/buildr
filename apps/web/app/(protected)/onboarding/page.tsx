"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { getUserWorkspace } from "@/actions/workspace/check-workspace";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Check if user already has a workspace
  useEffect(() => {
    async function checkWorkspace() {
      try {
        const workspace = await getUserWorkspace();

        if (workspace) {
          router.push(`/${workspace.slug}/projects`);
        }
      } catch (err) {
        console.error("Error checking workspace:", err);
        toast.error("Error checking workspace!");
      } finally {
        setChecking(false);
      }
    }
    checkWorkspace();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return setError("Both fields are required.");
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:8080/api/workspace`,
        { name, slug },
        { withCredentials: true },
      );

      toast.success("Workspace created successfully!");
      router.push(`/${response.data.slug}/projects`);
    } catch (err: any) {
      console.error("Error creating workspace:", err);
      if (err.response?.status === 422) {
        toast.error("Workspace slug already in use!");
        setError("Workspace slug already in use!");
      } else {
        toast.error("Failed to create workspace. Please try again.");
        setError("Failed to create workspace. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-8 md:px-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-lg bg-background p-6 sm:p-8 rounded-2xl shadow-sm"
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Finish Setting Up</FieldLegend>
            <FieldDescription>
              Create your workspace to start deploying.
            </FieldDescription>

            {/* Workspace Name */}
            <Field>
              <FieldLabel htmlFor="name">Workspace Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Evil Rabbit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            {/* Workspace Slug / URL */}
            <Field>
              <FieldLabel htmlFor="workspace-slug">Workspace URL</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>buildrr.smnthjm08.xyz/</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="slug"
                  name="slug"
                  placeholder="your-workspace"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                  }
                  required
                />
                <InputGroupAddon align="inline-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton className="rounded-full" size="icon-xs">
                        <InfoCircledIcon />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      This is your workspace link or slug.
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                This will be your public workspace URL.
              </FieldDescription>
            </Field>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </FieldSet>

          {/* Submit + Cancel */}
          <Field
            orientation="horizontal"
            className="mt-6 gap-3 flex justify-end"
          >
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
