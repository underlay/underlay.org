/*
  Warnings:

  - You are about to drop the column `lastPublished` on the `collections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "collections" DROP COLUMN "lastPublished",
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "publishedDataSize" BYTEA;
