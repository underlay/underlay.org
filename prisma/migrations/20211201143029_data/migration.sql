/*
  Warnings:

  - You are about to drop the `Schema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Schema";

-- CreateTable
CREATE TABLE "Entities" (
    "id" TEXT NOT NULL,
    "entityJson" TEXT NOT NULL,

    CONSTRAINT "Entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchemaNode" (
    "id" TEXT NOT NULL,
    "nodeJson" TEXT NOT NULL,

    CONSTRAINT "SchemaNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL,
    "relationshipJson" TEXT NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);
