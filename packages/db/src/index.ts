import { PrismaClient } from "./generated/prisma";
import dotenv from "dotenv";

dotenv.config();

const prismaClientSingleton = () => {
  return new PrismaClient();
};

console.log("Database URL:", process.env.DATABASE_URL);
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma: ReturnType<typeof prismaClientSingleton> =
  globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
