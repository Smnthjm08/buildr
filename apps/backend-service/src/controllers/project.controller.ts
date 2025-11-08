import prisma from "@workspace/db";
import { Request, Response } from "express";


export const getProjects = async (req: Request, res: Response) => {
  try {
    const workspace = req.workspace;

    if (!workspace) {
      return res.status(403).json({ error: "Workspace not found or unauthorized." });
    }

    const projects = await prisma.project.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error("error fetching projects", error);
    return res.status(500).json({ error: "Error fetching projects" });
  }
};




export const createProject = async () => {};
export const updateProject = async () => {};
export const deleteProject = async () => {};
