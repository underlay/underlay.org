-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "version" DROP NOT NULL,
ALTER COLUMN "version" DROP DEFAULT;
