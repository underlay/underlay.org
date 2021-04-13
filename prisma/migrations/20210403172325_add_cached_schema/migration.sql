/*
  Warnings:

  - You are about to drop the column `instance` on the `collection_versions` table. All the data in the column will be lost.
  - Added the required column `schema_uri` to the `collection_versions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instance_uri` to the `collection_versions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `schema` on the `collection_versions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "collection_versions" DROP COLUMN "instance",
ADD COLUMN     "schema_uri" TEXT NOT NULL,
ADD COLUMN     "instance_uri" TEXT NOT NULL,
DROP COLUMN "schema",
ADD COLUMN     "schema" BYTEA NOT NULL;
