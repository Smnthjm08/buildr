/*
  Warnings:

  - You are about to drop the column `walletAddress` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicKey]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicKey` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."user_walletAddress_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "walletAddress",
ADD COLUMN     "publicKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_publicKey_key" ON "user"("publicKey");
