"use client";

import { axiosInstance } from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [githubUrl, setGithubUrl] = useState(
    "https://github.com/smnthjm08/buildrr"
  );
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await axiosInstance.get("/projects");
      console.log("projects", data);
    };
    fetchProjects();
  }, []);

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
            await axiosInstance.post("/deploy", { githubUrl });
          }}
        >
          Deploy
        </Button>
      </Field>
    </main>
  );
}
