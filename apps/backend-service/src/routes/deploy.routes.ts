import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getGitHubRepos,
} from "../controllers/github.controller";
import { createProjectAndFirstDeployment } from "../controllers/deploy.controller";

const deployRoutes = Router();

deployRoutes.post("/github", authMiddleware, createProjectAndFirstDeployment);
deployRoutes.get("/repos", authMiddleware, getGitHubRepos);

export default deployRoutes;
