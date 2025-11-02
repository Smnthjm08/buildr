import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });


/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
}

export default nextConfig
