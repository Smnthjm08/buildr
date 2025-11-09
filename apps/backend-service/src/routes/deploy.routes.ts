import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  connectGitHub,
  getGitHubRepos,
} from "../controllers/github.controller";

const deployRoutes = Router();

deployRoutes.post("/github", authMiddleware, connectGitHub);
deployRoutes.get("/repos", authMiddleware, getGitHubRepos);

export default deployRoutes;
