/*
  Warnings:

  - A unique constraint covering the columns `[role_name]` on the table `gis_role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "gis_role_role_name_key" ON "gis_role"("role_name");
