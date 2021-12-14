/*
  Warnings:

  - You are about to drop the column `left_drainase_condiiton` on the `gis_drainase` table. All the data in the column will be lost.
  - You are about to drop the column `right_drainase_condiiton` on the `gis_drainase` table. All the data in the column will be lost.
  - Added the required column `left_drainase_condition` to the `gis_drainase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `right_drainase_condition` to the `gis_drainase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gis_drainase" DROP COLUMN "left_drainase_condiiton",
DROP COLUMN "right_drainase_condiiton",
ADD COLUMN     "left_drainase_condition" TEXT NOT NULL,
ADD COLUMN     "right_drainase_condition" TEXT NOT NULL;
