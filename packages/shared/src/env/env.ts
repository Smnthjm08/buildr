import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;

  if (value === undefined) {
    throw Error(`Missing String environment variable for ${key}`);
  }

  return value;
};

const BACKEND_PORT = getEnv("BACKEND_PORT", "8080");
const NODE_ENV = getEnv("NODE_ENV", "development");
const DATABASE_URL = getEnv("DATABASE_URL", "development");


export default { BACKEND_PORT, NODE_ENV, DATABASE_URL };