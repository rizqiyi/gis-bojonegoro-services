/*
  Warnings:

  - You are about to drop the `gis_image_drainase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "gis_image_drainase" DROP CONSTRAINT "gis_image_drainase_drainase_id_fkey";

-- DropTable
DROP TABLE "gis_image_drainase";

-- CreateTable
CREATE TABLE "gis_left_images_drainase" (
    "id" SERIAL NOT NULL,
    "image_path" TEXT NOT NULL,
    "image_name" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "drainase_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gis_left_images_drainase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gis_right_images_drainase" (
    "id" SERIAL NOT NULL,
    "image_path" TEXT NOT NULL,
    "image_name" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "drainase_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gis_right_images_drainase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gis_left_images_drainase" ADD CONSTRAINT "gis_left_images_drainase_drainase_id_fkey" FOREIGN KEY ("drainase_id") REFERENCES "gis_drainase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gis_right_images_drainase" ADD CONSTRAINT "gis_right_images_drainase_drainase_id_fkey" FOREIGN KEY ("drainase_id") REFERENCES "gis_drainase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
