/*
  Warnings:

  - You are about to drop the column `isPublic` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `publishedDataSize` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `schema` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `schemaMapping` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `slugPrefix` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `slugSuffix` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `exports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug_suffix]` on the table `collections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug_suffix` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "collections_slugSuffix_key";

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "isPublic",
DROP COLUMN "publishedAt",
DROP COLUMN "publishedDataSize",
DROP COLUMN "schema",
DROP COLUMN "schemaMapping",
DROP COLUMN "slugPrefix",
DROP COLUMN "slugSuffix",
DROP COLUMN "version",
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug_prefix" TEXT,
ADD COLUMN     "slug_suffix" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "exports" DROP COLUMN "isPublic",
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_suffix_key" ON "collections"("slug_suffix");
