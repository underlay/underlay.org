/*
  Warnings:

  - You are about to drop the column `permission` on the `collections` table. All the data in the column will be lost.
  - Added the required column `isPublic` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collections" DROP COLUMN "permission",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL;
