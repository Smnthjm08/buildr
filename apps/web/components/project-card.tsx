import { Button } from "@/components/ui/button";
import {
  GitHubLogoIcon,
  ExternalLinkIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    slug: string;
    repoUrl: string;
    framework: string;
    outputDir: string;
    buildCommand: string;
    createdAt: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const createdDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  const frameworkColors: Record<string, string> = {
    NEXTJS: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    REACT: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    VUE: "bg-green-500/10 text-green-600 dark:text-green-400",
    VITE: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    SVELTE: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  const frameworkBadgeColor =
    frameworkColors[project.framework] || frameworkColors.NEXTJS;

  return (
    <div className="group bg-card border border-border rounded-lg p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Framework Icon */}
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <GitHubLogoIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {project.slug}
            </p>
          </div>
        </div>
        <Button className="p-2 hover:bg-secondary rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          <DotsHorizontalIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Framework Badge and Meta */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${frameworkBadgeColor}`}
        >
          {project.framework}
        </span>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>

      {/* Repository Link */}
      <a
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
      >
        <GitHubLogoIcon className="w-4 h-4" />
        View Repository
        <ExternalLinkIcon className="w-3 h-3" />
      </a>

      {/* Build Info */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y border-border mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Output Directory</p>
          <p className="font-mono text-sm text-foreground">
            {project.outputDir}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Build Command</p>
          <p className="font-mono text-sm text-foreground truncate">
            {project.buildCommand}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          View Details
        </Button>
        <Button size="sm" className="flex-1">
          Deploy
        </Button>
      </div>
    </div>
  );
}
