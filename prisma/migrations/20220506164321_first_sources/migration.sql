-- CreateTable
CREATE TABLE "inputs" (
    "id" TEXT NOT NULL,
    "reductionType" TEXT NOT NULL,
    "outputData" JSONB NOT NULL,
    "schema_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "source_csv_id" TEXT,
    "source_api_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources_csv" (
    "id" TEXT NOT NULL,
    "mapping" JSONB NOT NULL,
    "fileUri" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_csv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources_apis" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_apis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inputs" ADD CONSTRAINT "inputs_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputs" ADD CONSTRAINT "inputs_schema_id_fkey" FOREIGN KEY ("schema_id") REFERENCES "schemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputs" ADD CONSTRAINT "inputs_source_csv_id_fkey" FOREIGN KEY ("source_csv_id") REFERENCES "sources_csv"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputs" ADD CONSTRAINT "inputs_source_api_id_fkey" FOREIGN KEY ("source_api_id") REFERENCES "sources_apis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
