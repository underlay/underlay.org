/*
  Warnings:

  - A unique constraint covering the columns `[collection_id,number]` on the table `discussion_threads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `discussion_threads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "discussion_threads" ADD COLUMN     "entity_id" TEXT,
ADD COLUMN     "number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "discussion_threads_collection_id_number_key" ON "discussion_threads"("collection_id", "number");
