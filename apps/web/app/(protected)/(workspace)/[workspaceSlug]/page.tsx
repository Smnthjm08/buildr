"use client";

import { axiosInstance } from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import {ImportIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  slug: string;
  repoUrl: string;
  framework: string;
  outputDir: string;
  buildCommand: string;
  createdAt: string;
}

interface Repository {
  name: string;
  url: string;
  description?: string;
  user: string;
  language?: string;
  stars?: number;
}

export default function ProjectsPage() {
  const [githubUrl, setGithubUrl] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get("/project");
        const data = response?.data?.data;

        setProjects(data?.projects || []);
        setRepositories(data?.repositories || []);
        setIsConnected(data?.repositories !== null);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    try {
      await axiosInstance.post("/git/get-info", { githubUrl });
      setGithubUrl("");
      // Refetch projects after creating a new one
      const response = await axiosInstance.get("/project");
      setProjects(response?.data?.data?.projects || []);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="w-full min-h-screen px-4">
      <div className="border-b border-border bg-secondary/30">
        <div className="w-full px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Let&apos;s build something new
          </h1>
          <p className="text-muted-foreground mb-8">
            Import a Git repository to get started
          </p>

          <div className="flex gap-3 w-full">
            <div className="flex-1 relative">
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                type="text"
                placeholder="Enter a Git repository URL to deploy..."
                className="pr-10 h-11"
              />
              <GitHubLogoIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <Button onClick={handleCreate} className="px-8 h-11">
              New
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full py-12 px-4">
        <div className="flex gap-8">
          <div className="w-80 flex-shrink-0 space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Import Git Repository
              </h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded hover:bg-secondary/70 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <GitHubLogoIcon className="w-5 h-5" />
                      <span className="font-medium text-sm">
                        {repositories[0]?.user}
                      </span>
                    </div>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {!isConnected ? (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded">
                    <p className="text-xs text-destructive font-medium mb-3">
                      GitHub not connected
                    </p>
                    <Button
                      onClick={() => {
                        window.location.href =
                          "https://github.com/apps/buildrr-dev/installations/new";
                      }}
                      className="w-full h-9 text-xs"
                      variant="outline"
                    >
                      Connect GitHub
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded">
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      ✓ GitHub Connected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isConnected && repositories.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Available Repositories
                </h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {repositories.map((repo, idx) => (
                    <Link
                      key={idx}
                      href={repo.url}
                      rel="noopener noreferrer"
                      className="block bg-card border border-border rounded p-3 hover:border-primary/50 hover:bg-secondary/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm text-foreground truncate">
                          {repo.name}
                        </p>
                        <div className="flex gap-2">
                          <Button className="h-6" size={"sm"} onClick={()=>router.push("")} >
                            Import
                            <ImportIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </Button>
                          <ExternalLinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                        {repo.language && (
                          <span className="inline-flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {repo.language}
                          </span>
                        )}
                        {repo.stars !== undefined && (
                          <span>⭐ {repo.stars}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Your Projects
              </h2>
              {projects.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {projects.length}{" "}
                  {projects.length === 1 ? "project" : "projects"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border rounded-lg bg-secondary/20">
                <p className="text-muted-foreground">
                  No projects yet. Import a repository to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
