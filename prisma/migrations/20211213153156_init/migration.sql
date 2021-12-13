/*
  Warnings:

  - You are about to drop the column `user_id` on the `gis_role` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "gis_role_user_id_key";

-- AlterTable
ALTER TABLE "gis_role" DROP COLUMN "user_id";
