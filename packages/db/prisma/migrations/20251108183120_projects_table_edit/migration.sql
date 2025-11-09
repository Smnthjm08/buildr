/*
  Warnings:

  - The `framework` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Framework" AS ENUM ('HTML', 'REACT', 'NEXTJS');

-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('QUEUED', 'BUILDING', 'DEPLOYING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "framework",
ADD COLUMN     "framework" "Framework",
ALTER COLUMN "outputDir" SET DEFAULT 'dist',
ALTER COLUMN "buildCommand" SET DEFAULT 'npm run build';
