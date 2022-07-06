-- CreateTable
CREATE TABLE "discussion_threads" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "user_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_items" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "discussion_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_items" ADD CONSTRAINT "discussion_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_items" ADD CONSTRAINT "discussion_items_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussion_threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
