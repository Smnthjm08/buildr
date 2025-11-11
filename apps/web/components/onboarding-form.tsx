"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { axiosInstance } from "@/utils/axios";

export default function OnboardingForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return setError("Both fields are required.");

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/workspace", { slug, name });

      toast.success("Workspace created successfully!");

      if (response.status === 201) {
        router.refresh();
        router.push(`/${response.data.slug}/`);
      }
    } catch (err: any) {
      console.error("Error creating workspace:", err);

      if (err.response?.status === 422) {
        setError("Workspace slug already in use!");
        toast.error("Workspace slug already in use!");
      } else {
        setError("Failed to create workspace. Please try again.");
        toast.error("Failed to create workspace. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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

            <Field>
              <FieldLabel htmlFor="name">Workspace Name</FieldLabel>
              <Input
                id="name"
                placeholder="Evil Rabbit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="slug">Workspace URL</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>buildrr.smnthjm08.xyz/</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="slug"
                  placeholder="your-workspace"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value.toLowerCase().trim().replace(/\s+/g, "-"),
                    )
                  }
                  required
                />
                <InputGroupAddon align="inline-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        className="rounded-full"
                        size="icon-xs"
                        type="button"
                      >
                        <InfoCircledIcon />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      This will be your workspace slug / URL.
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>This will be your public workspace URL.</FieldDescription>
            </Field>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </FieldSet>

          <Field orientation="horizontal" className="mt-6 gap-3 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
