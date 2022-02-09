/*
  Warnings:

  - You are about to drop the column `profileId` on the `communities` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `signup_completed_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `signup_email_count` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `signup_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_CollectionToCommunity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollectionToDiscussion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollectionToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommunityToDiscussion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collection_collaborators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `community_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discussion_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discussions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[namespaceId]` on the table `communities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[namespaceId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `namespaceId` to the `collections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namespaceId` to the `communities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namespaceId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CollectionToCommunity" DROP CONSTRAINT "_CollectionToCommunity_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToCommunity" DROP CONSTRAINT "_CollectionToCommunity_B_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToDiscussion" DROP CONSTRAINT "_CollectionToDiscussion_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToDiscussion" DROP CONSTRAINT "_CollectionToDiscussion_B_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToUser" DROP CONSTRAINT "_CollectionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToUser" DROP CONSTRAINT "_CollectionToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_CommunityToDiscussion" DROP CONSTRAINT "_CommunityToDiscussion_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommunityToDiscussion" DROP CONSTRAINT "_CommunityToDiscussion_B_fkey";

-- DropForeignKey
ALTER TABLE "collection_collaborators" DROP CONSTRAINT "collection_collaborators_collection_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_collaborators" DROP CONSTRAINT "collection_collaborators_user_id_fkey";

-- DropForeignKey
ALTER TABLE "communities" DROP CONSTRAINT "communities_profileId_fkey";

-- DropForeignKey
ALTER TABLE "community_members" DROP CONSTRAINT "community_members_community_id_fkey";

-- DropForeignKey
ALTER TABLE "community_members" DROP CONSTRAINT "community_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "discussion_items" DROP CONSTRAINT "discussion_items_discussion_id_fkey";

-- DropForeignKey
ALTER TABLE "discussion_items" DROP CONSTRAINT "discussion_items_user_id_fkey";

-- DropForeignKey
ALTER TABLE "discussions" DROP CONSTRAINT "discussions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_profileId_fkey";

-- DropIndex
DROP INDEX "communities_profileId_unique";

-- DropIndex
DROP INDEX "users.signup_token_unique";

-- DropIndex
DROP INDEX "users_profileId_unique";

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "namespaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "communities" DROP COLUMN "profileId",
ADD COLUMN     "namespaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hash",
DROP COLUMN "profileId",
DROP COLUMN "salt",
DROP COLUMN "signup_completed_at",
DROP COLUMN "signup_email_count",
DROP COLUMN "signup_token",
ADD COLUMN     "namespaceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CollectionToCommunity";

-- DropTable
DROP TABLE "_CollectionToDiscussion";

-- DropTable
DROP TABLE "_CollectionToUser";

-- DropTable
DROP TABLE "_CommunityToDiscussion";

-- DropTable
DROP TABLE "collection_collaborators";

-- DropTable
DROP TABLE "community_members";

-- DropTable
DROP TABLE "discussion_items";

-- DropTable
DROP TABLE "discussions";

-- DropTable
DROP TABLE "profiles";

-- DropTable
DROP TABLE "sessions";

-- CreateTable
CREATE TABLE "namespaces" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "namespaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaborators" (
    "id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "namespaces_slug_key" ON "namespaces"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "communities_namespaceId_key" ON "communities"("namespaceId");

-- CreateIndex
CREATE UNIQUE INDEX "users_namespaceId_key" ON "users"("namespaceId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "users.email_unique" RENAME TO "users_email_key";
