/*
  Warnings:

  - Added the required column `role_name` to the `gis_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gis_user" ADD COLUMN     "role_name" TEXT NOT NULL;
