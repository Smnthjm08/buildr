"use client";

import type React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/utils/axios";
import { useSession } from "@workspace/shared/auth/client";

export default function NewProjectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const repoUrlParam = searchParams.get("repo") ?? "";

  const [name, setName] = useState("");
  const [framework, setFramework] = useState("");
  const [outputDir, setOutputDir] = useState("dist");
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !framework) return;

    setIsLoading(true);

    const payload = {
      repoUrl: repoUrlParam,
      name,
      framework,
      outputDir,
      buildCommand,
    };

    console.log("Creating project with:", payload);

    const { data, status } = await axiosInstance.post(
      "/deploy/github",
      payload,
    );
    console.log("deploy", data);
    console.log("status", status);

    if (status === 201) {
      router.push(`/${session?.workspace?.slug}`);
    }
  }

  function handleCancel() {
    router.back();
  }

  return (
    <main className="h-screen overflow-y-auto">
      <div className="w-full h-full max-w-2xl mx-auto px-8 py-6 flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">
              Create New Project
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure your project details and deployment settings.
            </p>
          </div>

          <FieldSet className="space-y-4">
            <div className="pb-4 border-b border-border">
              <Field>
                <FieldLabel className="text-sm">Repository URL</FieldLabel>
                <Input
                  value={repoUrlParam}
                  disabled
                  className="bg-muted cursor-not-allowed text-sm h-8"
                />
              </Field>
            </div>

            <div className="pb-4 border-b border-border">
              <FieldGroup className="space-y-3">
                <Field>
                  <FieldLabel className="text-sm">Project Name</FieldLabel>
                  <Input
                    placeholder="e.g. my-awesome-app"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-sm h-8"
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-sm">Framework</FieldLabel>
                  <Select value={framework} onValueChange={setFramework}>
                    <SelectTrigger className="text-sm h-8">
                      <SelectValue placeholder="Select a framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REACT">React</SelectItem>
                      <SelectItem value="NEXT_JS">Next.js</SelectItem>
                      <SelectItem value="VUE">Vue</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </div>

            <div className="pb-4">
              <FieldGroup className="space-y-3">
                <Field>
                  <FieldLabel className="text-sm">Output Directory</FieldLabel>
                  <Input
                    placeholder="dist"
                    value={outputDir}
                    onChange={(e) => setOutputDir(e.target.value)}
                    className="text-sm h-8"
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-sm">Build Command</FieldLabel>
                  <Input
                    placeholder="npm run build"
                    value={buildCommand}
                    onChange={(e) => setBuildCommand(e.target.value)}
                    className="text-sm h-8"
                  />
                </Field>
              </FieldGroup>
            </div>
          </FieldSet>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="submit"
              disabled={!name || !framework || isLoading}
              className="flex-1 h-8 text-sm"
            >
              {isLoading ? "Deploying..." : "Deploy Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-8 text-sm bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
