/*
  Warnings:

  - A unique constraint covering the columns `[slug_prefix,namespace_id]` on the table `collections` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug_prefix` on table `collections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "slug_prefix" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_prefix_namespace_id_key" ON "collections"("slug_prefix", "namespace_id");
