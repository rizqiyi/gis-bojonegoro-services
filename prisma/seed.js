import users from "./users.js";
import roles from "./roles.js";
import drainases from "./drainases.js";
import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

const main = async () => {
  // for (let role of roles) {
  //   await prisma.gis_role.create({
  //     data: role,
  //   });
  // }

  for (let user of users) {
    await prisma.gis_user.create({
      data: user,
    });
  }

  // drainases.map(
  //   async (drainase) =>
  //     await prisma.gis_drainase.create({
  //       data: {
  //         ...drainase,
  //         images: {
  //           create: [
  //             {
  //               image_path: "test",
  //               image_name: "test.png",
  //               image_id: "1",
  //             },
  //             {
  //               image_path: "rizqi",
  //               image_name: "rizqi2.png",
  //               image_id: "2",
  //             },
  //           ],
  //         },
  //       },
  //     })
  // );
};

main()
  .then(() => console.log("data created"))
  .catch((err) => console.error(err.message));
