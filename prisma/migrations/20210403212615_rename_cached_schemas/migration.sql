/*
  Warnings:

  - You are about to drop the column `schema` on the `collection_versions` table. All the data in the column will be lost.
  - You are about to drop the column `draftVersionNumber` on the `schemas` table. All the data in the column will be lost.
  - You are about to drop the column `draftContent` on the `schemas` table. All the data in the column will be lost.
  - You are about to drop the column `draftReadme` on the `schemas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pipeline_id,executionNumber]` on the table `executions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schema_instance` to the `collection_versions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schema_instance` to the `schema_versions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "executions.user_id_executionNumber_unique";

-- AlterTable
ALTER TABLE "collection_versions" DROP COLUMN "schema",
ADD COLUMN     "schema_instance" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "schema_versions" ADD COLUMN     "schema_instance" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "schemas" DROP COLUMN "draftVersionNumber",
DROP COLUMN "draftContent",
DROP COLUMN "draftReadme",
ADD COLUMN     "content" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "readme" TEXT NOT NULL DEFAULT E'';

-- CreateIndex
CREATE UNIQUE INDEX "executions.pipeline_id_executionNumber_unique" ON "executions"("pipeline_id", "executionNumber");
