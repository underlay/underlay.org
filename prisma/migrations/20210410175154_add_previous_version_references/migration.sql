/*
  Warnings:

  - A unique constraint covering the columns `[previous_version_id]` on the table `collection_versions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[previous_execution_id]` on the table `executions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[previous_version_id]` on the table `schema_versions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "collection_versions" ADD COLUMN     "previous_version_id" TEXT;

-- AlterTable
ALTER TABLE "executions" ADD COLUMN     "previous_execution_id" TEXT;

-- AlterTable
ALTER TABLE "schema_versions" ADD COLUMN     "previous_version_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "collection_versions_previous_version_id_unique" ON "collection_versions"("previous_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "executions_previous_execution_id_unique" ON "executions"("previous_execution_id");

-- CreateIndex
CREATE UNIQUE INDEX "schema_versions_previous_version_id_unique" ON "schema_versions"("previous_version_id");

-- AddForeignKey
ALTER TABLE "collection_versions" ADD FOREIGN KEY ("previous_version_id") REFERENCES "collection_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD FOREIGN KEY ("previous_execution_id") REFERENCES "executions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schema_versions" ADD FOREIGN KEY ("previous_version_id") REFERENCES "schema_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
