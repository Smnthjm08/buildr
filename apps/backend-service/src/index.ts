import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import env from "@workspace/shared/env";
import { resolve } from "path";
import { auth } from '@workspace/shared/auth/server';
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import authMiddleware from "./middleware";

dotenv.config({ path: resolve(__dirname, "../../../.env") });

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/{any}", toNodeHandler(auth)); // For ExpressJS v4

console.log("Starting backend service...");

app.get("/api/health", (req, res) => {
  res.status(200).send({ status: "ok", env: process.env.NODE_ENV! });
});

app.get("/api/me", authMiddleware, async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});

const PORT = env.BACKEND_PORT || 7000;
console.log(`Using port: ${PORT}`, process.env.NODE_ENV!);

app.listen(PORT, () => {
  console.log(`Backend service is running on port ${PORT}`);
});
