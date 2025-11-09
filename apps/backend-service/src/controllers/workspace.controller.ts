import prisma from "@workspace/db";
import { Request, Response } from "express";

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;

    if(!name || !slug){
      res.status(500).json({message: "Missing name/slug inputs"})
    }

    const existingSlug = await prisma.workspace.findUnique({
      where: {
        slug: slug,
      },
    });

    if (existingSlug) {
      res.status(422).json("Workspace slug already in use!");
      return;
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: name,
        slug: slug,
        userId: req.user.id,
      },
    });

    res.status(201).json(workspace);
    return;
  } catch (error) {
    console.log("error creating workspace\n", error);
    return;
  }
};
