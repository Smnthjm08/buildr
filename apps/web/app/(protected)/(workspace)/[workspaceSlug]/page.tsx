"use client";

import { axiosInstance } from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [githubUrl, setGithubUrl] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await axiosInstance.get("/project");
      setProjects(data?.data?.data);
    };
    fetchProjects();
  }, []);

  console.log("projects", projects);

  return (
    <main className="flex w-full justify-center mt-10">
      <Field className="max-w-md w-full">
        <FieldTitle>Github URL</FieldTitle>
        <Input
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          type="text"
          placeholder="https://github.com/smnthjm08/buildrr"
        />
        <FieldDescription>Please make sure it&apos;s public</FieldDescription>
        <Button
          onClick={async () => {
            await axiosInstance.post("/git/get-info", { githubUrl });
          }}
        >
          Create
        </Button>

        <Button
          onClick={() => {
            window.location.href =
              "https://github.com/apps/buildrr-dev/installations/new";
          }}
          variant="outline"
        >
          Connect GitHub
        </Button>
      </Field>
    </main>
  );
}
