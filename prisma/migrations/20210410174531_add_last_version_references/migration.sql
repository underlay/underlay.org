/*
  Warnings:

  - A unique constraint covering the columns `[last_version_id]` on the table `collections` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[last_execution_id]` on the table `pipelines` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[last_version_id]` on the table `schemas` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "last_version_id" TEXT;

-- AlterTable
ALTER TABLE "pipelines" ADD COLUMN     "last_execution_id" TEXT;

-- AlterTable
ALTER TABLE "schemas" ADD COLUMN     "last_version_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "collections_last_version_id_unique" ON "collections"("last_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "pipelines_last_execution_id_unique" ON "pipelines"("last_execution_id");

-- CreateIndex
CREATE UNIQUE INDEX "schemas_last_version_id_unique" ON "schemas"("last_version_id");

-- AddForeignKey
ALTER TABLE "collections" ADD FOREIGN KEY ("last_version_id") REFERENCES "collection_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD FOREIGN KEY ("last_execution_id") REFERENCES "executions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schemas" ADD FOREIGN KEY ("last_version_id") REFERENCES "schema_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
