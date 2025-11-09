import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/project.controller";

const projectsRoutes = Router();

projectsRoutes.get("/", authMiddleware, getProjects);
projectsRoutes.post("/", authMiddleware, createProject);
projectsRoutes.put("/:id", authMiddleware, updateProject);
projectsRoutes.delete("/:id", authMiddleware, deleteProject);

export default projectsRoutes;
