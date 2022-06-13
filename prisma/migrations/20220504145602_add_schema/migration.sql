-- CreateTable
CREATE TABLE "schemas" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schemas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schemas" ADD CONSTRAINT "schemas_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
