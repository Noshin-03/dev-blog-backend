/*
  Warnings:

  - You are about to drop the column `summaryGeneratedAt` on the `stories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth" ADD COLUMN     "changePasswordToken" TEXT,
ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "stories" DROP COLUMN "summaryGeneratedAt";
