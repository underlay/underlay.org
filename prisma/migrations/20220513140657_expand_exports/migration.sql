/*
  Warnings:

  - You are about to drop the column `size` on the `exports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug,collection_id]` on the table `exports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schema_id` to the `exports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `exports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exports" DROP COLUMN "size",
ADD COLUMN     "schema_id" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "export_versions" (
    "id" TEXT NOT NULL,
    "fileUri" TEXT NOT NULL,
    "version_id" TEXT NOT NULL,
    "export_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "export_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_uses" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "export_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "export_uses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exports_slug_collection_id_key" ON "exports"("slug", "collection_id");

-- AddForeignKey
ALTER TABLE "exports" ADD CONSTRAINT "exports_schema_id_fkey" FOREIGN KEY ("schema_id") REFERENCES "schemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_versions" ADD CONSTRAINT "export_versions_export_id_fkey" FOREIGN KEY ("export_id") REFERENCES "exports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_versions" ADD CONSTRAINT "export_versions_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_uses" ADD CONSTRAINT "export_uses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_uses" ADD CONSTRAINT "export_uses_export_id_fkey" FOREIGN KEY ("export_id") REFERENCES "exports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
