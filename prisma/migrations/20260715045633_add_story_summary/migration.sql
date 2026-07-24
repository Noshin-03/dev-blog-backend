-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "autoSummarize" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "summaryGeneratedAt" TIMESTAMP(3);
