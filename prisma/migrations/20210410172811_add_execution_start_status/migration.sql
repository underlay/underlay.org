/*
  Warnings:

  - You are about to drop the column `url` on the `executions` table. All the data in the column will be lost.
  - Added the required column `started` to the `executions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "executions" DROP COLUMN "url",
ADD COLUMN     "started" BOOLEAN NOT NULL;
