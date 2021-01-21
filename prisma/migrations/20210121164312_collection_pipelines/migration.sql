/*
  Warnings:

  - You are about to drop the column `data_schema_id` on the `collection_versions` table. All the data in the column will be lost.
  - You are about to drop the column `meta_schema_id` on the `collection_versions` table. All the data in the column will be lost.
  - You are about to drop the column `meta_key` on the `collection_versions` table. All the data in the column will be lost.
  - You are about to drop the `assertions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assertions" DROP CONSTRAINT "assertions_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_versions" DROP CONSTRAINT "collection_versions_data_schema_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_versions" DROP CONSTRAINT "collection_versions_meta_schema_id_fkey";

-- AlterTable
ALTER TABLE "collection_versions" DROP COLUMN "data_schema_id",
DROP COLUMN "meta_schema_id",
DROP COLUMN "meta_key";

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "pipeline" JSONB;

-- DropTable
DROP TABLE "assertions";
