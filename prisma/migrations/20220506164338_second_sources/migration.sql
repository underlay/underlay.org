/*
  Warnings:

  - You are about to drop the `sources_apis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inputs" DROP CONSTRAINT "inputs_source_api_id_fkey";

-- DropTable
DROP TABLE "sources_apis";

-- CreateTable
CREATE TABLE "sources_api" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_api_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inputs" ADD CONSTRAINT "inputs_source_api_id_fkey" FOREIGN KEY ("source_api_id") REFERENCES "sources_api"("id") ON DELETE SET NULL ON UPDATE CASCADE;
