import prisma from "@workspace/db";
import { createProjectSchema } from "@workspace/shared/schema/projects";
import { Request, Response } from "express";
import path from "path";
import { simpleGit } from "simple-git";

export function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const createProjectAndFirstDeployment = async (req: Request, res: Response) => {
  try {
    const parsed = createProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsed.error.flatten(),
      });
    }

    const { name, repoUrl, framework, outputDir, buildCommand } = parsed.data;

    const workspaceId = req.workspace?.id;
    if (!workspaceId) {
      return res
        .status(403)
        .json({ error: "Workspace not found or unauthorized." });
    }

    const baseSlug = slugify(name);

    // Ensure unique slug *inside the same workspace*
    let slug = baseSlug;
    let count = 1;

    while (
      await prisma.project.findFirst({
        where: { slug, workspaceId },
      })
    ) {
      slug = `${baseSlug}-${count++}`;
    }

    const [project, deployment] = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name,
          slug,
          repoUrl,
          framework,
          outputDir,
          buildCommand,
          workspaceId,
        },
      });

      const deployment = await tx.deployment.create({
        data: {
          projectId: project.id,
          status: "queued",
          url: "",
        },
      });

      return [project, deployment];
    });

    if (!project?.repoUrl) {
      return res.status(400).json({ error: "Repository URL is required" });
    }

    const git = simpleGit();

    const clonePath = path.join(__dirname, `../../outputs/${project?.id}/${deployment.id}`);
    try {
      await git.clone(project.repoUrl, clonePath);
    } catch (gitError) {
      console.error("Git clone failed:", gitError);
      await prisma.deployment.update({
        where: { id: deployment.id },
        data: { status: "failed", logs: "Git clone failed" },
      });
      return res.status(500).json({ message: "Git clone failed", gitError });
    }

    return res.status(201).json({
      message: "Project created successfully",
      project,
      deployment,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Failed to create project", error });
  }
};
