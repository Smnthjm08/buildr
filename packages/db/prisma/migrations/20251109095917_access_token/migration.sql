/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `GitHubIntegration` table. All the data in the column will be lost.
  - Added the required column `accessTokenExpiresAt` to the `GitHubIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GitHubIntegration" DROP COLUMN "refreshToken",
ADD COLUMN     "accessTokenExpiresAt" TIMESTAMP(3) NOT NULL;
