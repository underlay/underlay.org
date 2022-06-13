/*
  Warnings:

  - Added the required column `size` to the `export_versions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "export_versions" ADD COLUMN     "size" TEXT NOT NULL;
