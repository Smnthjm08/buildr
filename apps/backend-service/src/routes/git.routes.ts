import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";

import { getRepoInfo } from "../controllers/git.controller";

const gitRoutes = Router();

// gitRoutes.get("/", authMiddleware, getProjects);
gitRoutes.post("/get-info", authMiddleware, getRepoInfo);
// gitRoutes.put("/:id", authMiddleware, updateProject);
// gitRoutes.delete("/:id", authMiddleware, deleteProject);

export default gitRoutes;
