/*
  Warnings:

  - A unique constraint covering the columns `[collection_id,version]` on the table `schemas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `schemas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schemas" ADD COLUMN     "content" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "schemas_collection_id_version_key" ON "schemas"("collection_id", "version");
