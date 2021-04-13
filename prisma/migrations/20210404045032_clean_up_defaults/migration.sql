-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "description" DROP DEFAULT;

-- AlterTable
ALTER TABLE "pipelines" ALTER COLUMN "description" DROP DEFAULT;

-- AlterTable
ALTER TABLE "schemas" ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "content" DROP DEFAULT,
ALTER COLUMN "readme" DROP DEFAULT;
