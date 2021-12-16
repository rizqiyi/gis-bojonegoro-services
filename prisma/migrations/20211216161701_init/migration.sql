-- DropForeignKey
ALTER TABLE "gis_image_drainase" DROP CONSTRAINT "gis_image_drainase_drainase_id_fkey";

-- AddForeignKey
ALTER TABLE "gis_image_drainase" ADD CONSTRAINT "gis_image_drainase_drainase_id_fkey" FOREIGN KEY ("drainase_id") REFERENCES "gis_drainase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
