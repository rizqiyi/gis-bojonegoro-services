/*
  Warnings:

  - Added the required column `manage` to the `gis_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gis_user" ADD COLUMN     "manage" TEXT NOT NULL;
