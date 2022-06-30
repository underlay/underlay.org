/*
  Warnings:

  - Made the column `text` on table `discussion_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "discussion_items" ALTER COLUMN "text" SET NOT NULL;
