"use server";

import prisma from "@repo/db";

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};
