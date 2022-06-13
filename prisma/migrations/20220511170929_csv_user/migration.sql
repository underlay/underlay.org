/*
  Warnings:

  - Added the required column `user_id` to the `sources_csv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sources_csv" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "sources_csv" ADD CONSTRAINT "sources_csv_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
