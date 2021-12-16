/*
  Warnings:

  - Added the required column `avatar_id` to the `gis_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gis_user" ADD COLUMN     "avatar_id" TEXT NOT NULL;
