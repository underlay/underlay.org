/*
  Warnings:

  - You are about to drop the column `hash` on the `collection_versions` table. All the data in the column will be lost.
  - You are about to drop the column `pipeline` on the `collections` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[execution_id]` on the table `collection_versions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `execution_id` to the `collection_versions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `collection_versions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schema` to the `collection_versions` table without a default value. This is not possible if the table is not empty.
  - Made the column `readme` on table `collection_versions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `readme` on table `schema_versions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `draftReadme` on table `schemas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "collection_versions" DROP COLUMN "hash",
ADD COLUMN     "execution_id" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "schema" BYTEA NOT NULL,
ALTER COLUMN "readme" SET NOT NULL;

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "pipeline";

-- AlterTable
ALTER TABLE "schema_versions" ALTER COLUMN "readme" SET NOT NULL,
ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "schemas" ALTER COLUMN "draftReadme" SET NOT NULL,
ALTER COLUMN "draftReadme" SET DEFAULT E'';

-- CreateTable
CREATE TABLE "pipelines" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT E'',
    "avatar" TEXT,
    "is_public" BOOLEAN NOT NULL,
    "graph" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executions" (
    "id" TEXT NOT NULL,
    "executionNumber" TEXT NOT NULL,
    "pipeline_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "graph" JSONB NOT NULL,
    "successful" BOOLEAN,
    "url" TEXT,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pipelines.agent_id_slug_unique" ON "pipelines"("agent_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "executions.user_id_executionNumber_unique" ON "executions"("user_id", "executionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "collection_versions.execution_id_unique" ON "collection_versions"("execution_id");

-- AddForeignKey
ALTER TABLE "pipelines" ADD FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_versions" ADD FOREIGN KEY ("execution_id") REFERENCES "executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
