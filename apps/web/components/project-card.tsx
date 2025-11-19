"use client";

import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useSession } from "@workspace/shared/auth/client";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    slug: string;
    repoUrl: string;
    framework: string;
    createdAt: string;
    deployments: Array<{
      id: string;
      url: string;
      status: string;
    }>;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const latestDeployment = project.deployments[0];
  const workspaceSlug = session?.workspace?.slug;

  const navigate = () => {
    if (!workspaceSlug) return;

    router.push(`/${workspaceSlug}/project/${project.id}`);
  };

  return (
    <div
      className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all cursor-pointer"
      onClick={navigate}
    >
      <div
        className="flex items-start justify-between mb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-1">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground">{project.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.repoUrl, "_blank");
            }}
          >
            <ExternalLinkIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="inline-flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          {project.framework}
        </span>

        <span>
          {new Date(project.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {latestDeployment && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                latestDeployment.status === "uploaded"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
              }`}
            >
              {latestDeployment.status}
            </span>

            <span className="text-xs text-muted-foreground">
              {project.deployments.length} deployment
              {project.deployments.length !== 1 ? "s" : ""}
            </span>
          </div>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate();
            }}
          >
            View Details
          </Button>
        </div>
      )}
    </div>
  );
}
