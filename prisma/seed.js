import users from "./users.js";
import roles from "./roles.js";
import drainases from "./drainases.js";
import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

const main = async () => {
  for (let user of users) {
    await prisma.gis_user.create({
      data: user,
    });
  }

  for (let role of roles) {
    await prisma.gis_role.create({
      data: role,
    });
  }

  drainases.map(
    async (drainase) =>
      await prisma.gis_drainase.create({
        data: {
          ...drainase,
          images: {
            create: [
              {
                image_path: "test",
                image_name: "test.png",
              },
              {
                image_path: "rizqi",
                image_name: "rizqi2.png",
              },
            ],
          },
        },
      })
  );
};

main()
  .then(() => console.log("data created"))
  .catch((err) => console.error(err.message));
