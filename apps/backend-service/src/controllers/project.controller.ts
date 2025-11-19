import { createProjectSchema } from "@workspace/shared/schema/projects";
import prisma from "@workspace/db";
import { Request, Response } from "express";
import { getInstallationRepositories } from "../utils/get-repos";

function transformRepo(repo: any) {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    description: repo.description,
    visibility: repo.visibility,
    url: repo.html_url,
    user: repo.owner.login,
    defaultBranch: repo.default_branch,
    language: repo.language,
    updatedAt: repo.updated_at,
  };
}

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
      include:{deployments:true},
      orderBy: { createdAt: "desc" },
    });

    let repositories = [];
    const integration = await prisma.gitHubIntegration.findUnique({
      where: { workspaceId: workspace.id },
    });

    if (integration) {
      const allRepos = await getInstallationRepositories(workspace.id);
      repositories = allRepos.map(transformRepo);
    }

    return res.status(200).json({
      message: "Projects fetched successfully",
      data: {
        projects,
        repositories,
        integration,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: "Error fetching projects" });
  }
};

export const getProjectsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workspace = req.workspace;

    if (!workspace) {
      return res
        .status(403)
        .json({ error: "Workspace not found or unauthorized." });
    }

    const project = await prisma.project.findFirst({
      where: { id, workspaceId: workspace.id },
      include: { deployments: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return res.status(500).json({ error: "Error fetching project" });
  }
}

export const createProject = async (req: Request, res: Response) => {
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

    const project = await prisma.project.create({
      data: {
        name,
        slug: name,
        repoUrl,
        framework,
        outputDir,
        buildCommand,
        workspaceId,
      },
    });

    return res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating a project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const updateProject = async () => {};
export const deleteProject = async () => {};
