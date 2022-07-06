/*
  Warnings:

  - You are about to drop the column `discussion_id` on the `discussion_items` table. All the data in the column will be lost.
  - Added the required column `discussion_thread_id` to the `discussion_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "discussion_items" DROP CONSTRAINT "discussion_items_discussion_id_fkey";

-- AlterTable
ALTER TABLE "discussion_items" DROP COLUMN "discussion_id",
ADD COLUMN     "discussion_thread_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "discussion_items" ADD CONSTRAINT "discussion_items_discussion_thread_id_fkey" FOREIGN KEY ("discussion_thread_id") REFERENCES "discussion_threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
