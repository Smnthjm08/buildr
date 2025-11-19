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
const BETTER_AUTH_SECRET = getEnv("BETTER_AUTH_SECRET", "development");
const BETTER_AUTH_URL = getEnv("BETTER_AUTH_URL", "http://localhost:3000");
const AWS_ACCESS_KEY_ID = getEnv("AWS_ACCESS_KEY_ID", "http://localhost:3000");
const AWS_SECRET_ACCESS_KEY = getEnv("AWS_SECRET_ACCESS_KEY", "http://localhost:3000");
const AWS_S3_BUCKET_NAME = getEnv("AWS_S3_BUCKET_NAME", "http://localhost:3000");
const AWS_S3_REGION = getEnv("AWS_S3_REGION", "http://localhost:3000");


export default {
  BACKEND_PORT,
  NODE_ENV,
  DATABASE_URL,
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_REGION,
};
