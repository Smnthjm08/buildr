import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/project.controller";

const projectsRoute = Router();

projectsRoute.get("/", authMiddleware, getProjects);
projectsRoute.post("/", authMiddleware, createProject);
projectsRoute.put("/:id", authMiddleware, updateProject);
projectsRoute.delete("/:id", authMiddleware, deleteProject);

export default projectsRoute;
