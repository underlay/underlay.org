/*
  Warnings:

  - You are about to drop the column `slug` on the `collections` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slugSuffix]` on the table `collections` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slugSuffix` on table `collections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "collections" DROP COLUMN "slug",
ADD COLUMN     "slugPrefix" TEXT,
ALTER COLUMN "slugSuffix" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "collections_slugSuffix_key" ON "collections"("slugSuffix");
