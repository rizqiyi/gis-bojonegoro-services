/*
  Warnings:

  - Made the column `fullname` on table `gis_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "gis_user" ALTER COLUMN "fullname" SET NOT NULL;
