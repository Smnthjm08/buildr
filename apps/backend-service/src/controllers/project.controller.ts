import { createProjectSchema } from "@workspace/shared/schema/projects";
import prisma from "@workspace/db";
import { Request, Response } from "express";

export const getProjects = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace;

    if (!workspace) {
      return res
        .status(403)
        .json({ error: "Workspace not found or unauthorized." });
    }

    const projects = await prisma.project.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Project fetched successfully",
      data: projects,
    });
  } catch (error) {
    console.error("error fetching projects", error);
    return res.status(500).json({ error: "Error fetching projects" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const parsed = createProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsed.error.flatten(),
      });
    }

    const { name, slug, repoUrl, framework, outputDir, buildCommand } =
      parsed.data;

    // TODO: Save to DB
    // const project = await prisma.project.create({ data: {...} })

    return res.status(201).json({
      message: "Project created successfully",
      data: { name, slug, repoUrl, framework, outputDir, buildCommand },
    });
  } catch (error) {
    console.error("Error creating a project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProject = async () => {};
export const deleteProject = async () => {};
