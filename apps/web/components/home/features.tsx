"use client";

import {
  GitBranchIcon,
  RocketIcon,
  CloudUploadIcon,
  SettingsIcon,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <GitBranchIcon className="h-8 w-8 text-primary" />,
      title: "Git Integration",
      desc: "Connect your GitHub repositories and deploy directly from your branches.",
    },
    {
      icon: <RocketIcon className="h-8 w-8 text-primary" />,
      title: "Fast Builds",
      desc: "Build and ship your projects in seconds using an optimized pipeline.",
    },
    {
      icon: <CloudUploadIcon className="h-8 w-8 text-primary" />,
      title: "Auto Deployments",
      desc: "Every push triggers a fresh build — no manual steps needed.",
    },
    {
      icon: <SettingsIcon className="h-8 w-8 text-primary" />,
      title: "Customizable",
      desc: "Full control over build commands, frameworks, and environments.",
    },
  ];

  return (
    <section className="py-18 bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">Why Buildrr?</h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg transition-all hover:bg-muted/50">
      <div className="mb-3">{icon}</div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
