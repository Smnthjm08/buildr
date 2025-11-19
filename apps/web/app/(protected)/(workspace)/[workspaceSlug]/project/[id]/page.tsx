"use client";

import { axiosInstance } from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Globe } from "lucide-react";

interface Deployment {
  id: string;
  url: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  commitHash: string | null;
  branch: string | null;
  logs: string | null;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  repoUrl: string;
  framework: string;
  outputDir: string;
  buildCommand: string;
  createdAt: string;
  deployments: Deployment[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/project/${params.id}`);
        setProject(response.data.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || "Project not found"}</p>
        <Button onClick={() => router.push("/")}>Go Back</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploaded":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "queued":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "building":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "failed":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        <div className="bg-card border border-border rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {project.name}
              </h1>
              <p className="text-muted-foreground">{project.slug}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(project.repoUrl, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Repository
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Framework</p>
              <p className="font-medium">{project.framework}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Build Command</p>
              <p className="font-mono text-xs bg-secondary px-2 py-1 rounded">
                {project.buildCommand}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Output Directory</p>
              <p className="font-mono text-xs bg-secondary px-2 py-1 rounded">
                {project.outputDir}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Created</p>
              <p className="font-medium">
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6">
            Deployments ({project.deployments.length})
          </h2>

          {project.deployments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg bg-secondary/20">
              <p className="text-muted-foreground">No deployments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {project.deployments.map((deployment) => (
                <div
                  key={deployment.id}
                  className="border border-border rounded-lg p-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(
                          deployment.status
                        )}`}
                      >
                        {deployment.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(deployment.startedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {deployment.status === "uploaded" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                `http://${deployment.id}.local:5001/index.html`,
                                "_blank"
                              )
                            }
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Local Dev
                          </Button>
                          {deployment.url && (
                            <Button
                              size="sm"
                              onClick={() =>
                                window.open(deployment.url, "_blank")
                              }
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Live
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground mb-1">
                        Deployment ID
                      </p>
                      <p className="font-mono bg-secondary px-2 py-1 rounded truncate">
                        {deployment.id}
                      </p>
                    </div>
                    {deployment.branch && (
                      <div>
                        <p className="text-muted-foreground mb-1">Branch</p>
                        <p className="font-mono bg-secondary px-2 py-1 rounded">
                          {deployment.branch}
                        </p>
                      </div>
                    )}
                    {deployment.commitHash && (
                      <div>
                        <p className="text-muted-foreground mb-1">Commit</p>
                        <p className="font-mono bg-secondary px-2 py-1 rounded truncate">
                          {deployment.commitHash.substring(0, 7)}
                        </p>
                      </div>
                    )}
                  </div>

                  {deployment.logs && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Logs</p>
                      <p className="text-xs font-mono bg-secondary px-2 py-1 rounded">
                        {deployment.logs}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}