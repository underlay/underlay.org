/*
  Warnings:

  - You are about to drop the `Entities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Relationship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchemaNode` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "schemaJson" JSONB;

-- DropTable
DROP TABLE "Entities";

-- DropTable
DROP TABLE "Relationship";

-- DropTable
DROP TABLE "SchemaNode";
