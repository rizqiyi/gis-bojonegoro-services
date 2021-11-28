-- CreateTable
CREATE TABLE "gis_role" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gis_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gis_role_user_id_key" ON "gis_role"("user_id");

-- AddForeignKey
ALTER TABLE "gis_role" ADD CONSTRAINT "gis_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "gis_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
