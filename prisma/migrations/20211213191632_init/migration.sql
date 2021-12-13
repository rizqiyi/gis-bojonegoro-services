-- CreateTable
CREATE TABLE "gis_user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "manage" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gis_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gis_role" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gis_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gis_user_username_key" ON "gis_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "gis_role_role_name_key" ON "gis_role"("role_name");
