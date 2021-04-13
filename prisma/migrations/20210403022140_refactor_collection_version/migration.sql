/*
  Warnings:

  - You are about to drop the column `url` on the `collection_versions` table. All the data in the column will be lost.
  - Added the required column `instance` to the `collection_versions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collection_versions" DROP COLUMN "url",
ADD COLUMN     "instance" TEXT NOT NULL,
ALTER COLUMN "schema" SET DATA TYPE TEXT;
