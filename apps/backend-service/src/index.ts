import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import env from "@workspace/shared/env";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("Starting backend service...");

app.get("/api/health", (req, res) => {
  res.status(200).send({ status: "ok", env: env.NODE_ENV });
});

const PORT = env.BACKEND_PORT || 7000;
console.log(`Using port: ${PORT}`, env.NODE_ENV);

app.listen(PORT, () => {
  console.log(`Backend service is running on port ${PORT}`);
});
