/*
  Warnings:

  - You are about to drop the column `namespaceId` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `namespaceId` on the `communities` table. All the data in the column will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[namespace_id]` on the table `communities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `namespace_id` to the `collections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namespace_id` to the `communities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "collaborators" DROP CONSTRAINT "collaborators_user_id_fkey";

-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_namespaceId_fkey";

-- DropForeignKey
ALTER TABLE "communities" DROP CONSTRAINT "communities_namespaceId_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_namespaceId_fkey";

-- DropIndex
DROP INDEX "communities_namespaceId_key";

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "namespaceId",
ADD COLUMN     "namespace_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "communities" DROP COLUMN "namespaceId",
ADD COLUMN     "namespace_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "profiles";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "namespace_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_namespace_id_key" ON "users"("namespace_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "communities_namespace_id_key" ON "communities"("namespace_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_namespace_id_fkey" FOREIGN KEY ("namespace_id") REFERENCES "namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_namespace_id_fkey" FOREIGN KEY ("namespace_id") REFERENCES "namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_namespace_id_fkey" FOREIGN KEY ("namespace_id") REFERENCES "namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
