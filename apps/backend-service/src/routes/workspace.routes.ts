import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";

import { createWorkspace } from "../controllers/workspace.controller";

const workspaceRoutes = Router();

// workspaceRoutes.get("/", authMiddleware, getProjects);
workspaceRoutes.post("/", authMiddleware, createWorkspace);
// workspaceRoutes.put("/:id", authMiddleware, updateProject);
// workspaceRoutes.delete("/:id", authMiddleware, deleteProject);

export default workspaceRoutes;
