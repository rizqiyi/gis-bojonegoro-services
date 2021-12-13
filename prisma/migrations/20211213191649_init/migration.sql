/*
  Warnings:

  - Added the required column `avatar` to the `gis_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gis_user" ADD COLUMN     "avatar" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "gis_drainase" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "district" TEXT NOT NULL,
    "sub_district" TEXT NOT NULL,
    "street_name" TEXT NOT NULL,
    "street_width" TEXT NOT NULL,
    "left_typical" TEXT NOT NULL,
    "left_drainase_depth" TEXT NOT NULL,
    "left_drainase_width" TEXT NOT NULL,
    "left_drainase_condiiton" TEXT NOT NULL,
    "right_typical" TEXT NOT NULL,
    "right_drainase_depth" TEXT NOT NULL,
    "right_drainase_width" TEXT NOT NULL,
    "right_drainase_condiiton" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "sta" TEXT NOT NULL,
    "street_path" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gis_drainase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gis_image_drainase" (
    "id" SERIAL NOT NULL,
    "image_path" TEXT NOT NULL,
    "image_name" TEXT NOT NULL,
    "drainase_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gis_image_drainase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gis_drainase" ADD CONSTRAINT "gis_drainase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "gis_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gis_image_drainase" ADD CONSTRAINT "gis_image_drainase_drainase_id_fkey" FOREIGN KEY ("drainase_id") REFERENCES "gis_drainase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
