/*
  Warnings:

  - Added the required column `image_id` to the `gis_image_drainase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gis_image_drainase" ADD COLUMN     "image_id" TEXT NOT NULL;
