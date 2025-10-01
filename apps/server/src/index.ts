import express, { Request, Response } from "express";
import prisma from "@repo/db";

const app = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "OK!" });
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ message: "fetched user successfully!", data: users });
});

app.listen(5001, () => {
  console.log("app is listening on port 5001");
});
