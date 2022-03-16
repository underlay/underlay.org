/*
  Warnings:

  - The `publishedDataSize` column on the `collections` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "collections" DROP COLUMN "publishedDataSize",
ADD COLUMN     "publishedDataSize" BIGINT;
