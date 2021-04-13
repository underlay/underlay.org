/*
  Warnings:

  - You are about to drop the column `agent_id` on the `collection_versions` table. All the data in the column will be lost.
  - You are about to drop the column `agent_id` on the `schema_versions` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `collection_versions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `schema_versions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "collection_versions" DROP CONSTRAINT "collection_versions_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "schema_versions" DROP CONSTRAINT "schema_versions_agent_id_fkey";

-- AlterTable
ALTER TABLE "collection_versions" DROP COLUMN "agent_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "schema_versions" DROP COLUMN "agent_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "collection_versions" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schema_versions" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
