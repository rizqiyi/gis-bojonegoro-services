import Prisma from "@prisma/client";
import ErrorHandler from "../../helpers/error.helper.js";
// import paginate from "../../helpers/paginate.helper.js";
import DrainasesSchema from "../../validations/drainases.validations.js";
import ImageKit from "../../helpers/imagekit.helper.js";

const prisma = new Prisma.PrismaClient();
const schema = new DrainasesSchema();

export default class Drainases {
  getDashboardData = async (req, res) => {
    try {
      const totalDrainase = await prisma.gis_drainase.count();
      const typicalTrapesium = await prisma.gis_drainase.count({
        where: {
          OR: [
            {
              left_typical: "Trapesium",
            },
            {
              right_typical: "Trapesium",
            },
          ],
        },
      });

      const typicalShapeU = await prisma.gis_drainase.count({
        where: {
          OR: [
            {
              left_typical: "Bentuk U",
            },
            {
              right_typical: "Bentuk U",
            },
          ],
        },
      });

      const typicalBronjong = await prisma.gis_drainase.count({
        where: {
          OR: [
            {
              left_typical: "Bronjong",
            },
            {
              right_typical: "Bronjong",
            },
          ],
        },
      });

      const typicalRect = await prisma.gis_drainase.count({
        where: {
          OR: [
            {
              left_typical: "Kotak/Tertutup",
            },
            {
              right_typical: "Kotak/Tertutup",
            },
          ],
        },
      });

      const goodCondition = await prisma.gis_drainase.count({
        where: {
          OR: [
            {
              left_drainase_condition: "Baik",
            },
            {
              right_drainase_condition: "Baik",
            },
          ],
        },
      });

      const lightBroken = await prisma.gis_drainase.count({
        where: {
          OR: [
            {
              left_drainase_condition: "Rusak Ringan",
            },
            {
              right_drainase_condition: "Rusak Ringan",
            },
          ],
        },
      });

      const mediumBroken = await prisma.gis_drainase.count({
        where: {
          OR: [
            {
              left_drainase_condition: "Rusak Sedang",
            },
            {
              right_drainase_condition: "Rusak Sedang",
            },
          ],
        },
      });

      const heavyBroken = await prisma.gis_drainase.count({
        where: {
          OR: [
            {
              left_drainase_condition: "Rusak Berat",
            },
            {
              right_drainase_condition: "Rusak Berat",
            },
          ],
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          total: totalDrainase,
          typicalTrapesium,
          typicalShapeU,
          typicalRect,
          typicalBronjong,
          goodCondition,
          lightBroken,
          mediumBroken,
          heavyBroken,
        },
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  get = async (req, res) => {
    try {
      // const page = parseInt(req.query.page ?? 1, 10);
      // const perPage = parseInt(req.query.perPage ?? 10, 10);

      // const offset = page * perPage - perPage;

      const drainase = await prisma.gis_drainase.findMany({
        where: {
          ...(req.query.start_date && req.query.end_date
            ? {
                createdAt: {
                  gte: new Date(req.query.start_date),
                  lt: new Date(req.query.end_date),
                },
              }
            : {}),
          district: {
            search: req.query.q,
          },
          sub_district: {
            search: req.query.q,
          },
          street_name: {
            search: req.query.q,
          },
          ...(req.query.street_path === "false"
            ? {}
            : { street_path: req.query.street_path }),
          ...(req.query.is_published
            ? { is_published: JSON.parse(req.query.is_published) }
            : {}),
          ...(req.query.sta
            ? {
                sta: {
                  gte: req.query.sta,
                },
              }
            : {}),
        },
        ...(req.query.order_by
          ? {
              orderBy: {
                createdAt: req.query.order_by,
              },
            }
          : {}),
        // skip: offset,
        // take: perPage,
        include: {
          left_images_drainase: true,
          right_images_drainase: true,
        },
      });

      // const data = await paginate(
      //   { count: drainase.length, rows: drainase },
      //   page,
      //   perPage
      // );

      return res.status(200).json({
        success: true,
        data: { data: drainase },
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  getByID = async (req, res) => {
    try {
      const drainase = await prisma.gis_drainase.findUnique({
        where: {
          id: +req.params.id,
        },
        include: {
          left_images_drainase: true,
          right_images_drainase: true,
        },
      });

      return res.status(200).json({
        success: true,
        data: drainase,
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  create = async (req, res) => {
    try {
      const isValidate = schema.DrainaseValidationSchema.validate(req.body);

      if (isValidate.error)
        return ErrorHandler(res, isValidate.error.details[0].message, 400);

      const images = [];

      [
        ...req.files.left_drainase_images,
        ...req.files.right_drainase_images,
      ].map((file) =>
        ImageKit.upload(
          {
            file: file.buffer.toString("base64"),
            fileName: `${file.fieldname}_${file.originalname}`,
            useUniqueFileName: true,
          },
          async (err, docs) => {
            if (err) throw err;

            images.push({
              image_path: docs.filePath,
              image_name: docs.name,
              image_id: docs.fileId,
            });

            if (
              images.length ===
              req.files.left_drainase_images.length +
                req.files.right_drainase_images.length
            ) {
              const rightImages = images.filter(
                (image) => image.image_name.split("_")[0] !== "left"
              );

              const leftImages = images.filter(
                (image) => image.image_name.split("_")[0] !== "right"
              );

              await prisma.gis_drainase.create({
                data: {
                  latitude: parseFloat(req.body.latitude),
                  longitude: parseFloat(req.body.longitude),
                  district: req.body.district,
                  sub_district: req.body.sub_district,
                  street_name: req.body.street_name,
                  street_width: req.body.street_width,
                  sta: req.body.sta,
                  street_path: req.user.payload.street_path,
                  right_images_drainase: {
                    create: rightImages,
                  },
                  left_images_drainase: {
                    create: leftImages,
                  },
                  left_typical: req.body.left_typical,
                  left_drainase_depth: req.body.left_drainase_depth,
                  left_drainase_width: req.body.left_drainase_width,
                  left_drainase_condition: req.body.left_drainase_condition,
                  right_typical: req.body.right_typical,
                  right_drainase_depth: req.body.right_drainase_depth,
                  right_drainase_width: req.body.right_drainase_width,
                  right_drainase_condition: req.body.right_drainase_condition,
                  note: req.body.note,
                  description: req.body.description,
                  is_published: JSON.parse(req.body.is_published),
                  user_id: +req.user.payload.id,
                },
              });

              return res.status(201).json({
                success: true,
                message: "Drainase berhasil ditambahkan",
              });
            }
          }
        )
      );
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  update = async (req, res) => {
    try {
      const isValidate = schema.DrainaseValidationSchema.validate(req.body);

      if (isValidate.error)
        return ErrorHandler(res, isValidate.error.details[0].message, 400);

      const requestBody = ({ rightImages = [], leftImages = [] }) => ({
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        district: req.body.district,
        sub_district: req.body.sub_district,
        street_name: req.body.street_name,
        street_width: req.body.street_width,
        sta: req.body.sta,
        street_path: req.user.payload.street_path,
        right_images_drainase: {
          create: rightImages,
        },
        left_images_drainase: {
          create: leftImages,
        },
        left_typical: req.body.left_typical,
        left_drainase_depth: req.body.left_drainase_depth,
        left_drainase_width: req.body.left_drainase_width,
        left_drainase_condition: req.body.left_drainase_condition,
        right_typical: req.body.right_typical,
        right_drainase_depth: req.body.right_drainase_depth,
        right_drainase_width: req.body.right_drainase_width,
        right_drainase_condition: req.body.right_drainase_condition,
        note: req.body.note,
        description: req.body.description,
        is_published: JSON.parse(req.body.is_published),
        user_id: +req.user.payload.id,
      });

      const images = [];

      if (
        [
          ...(req.files.left_drainase_images || []),
          ...(req.files.right_drainase_images || []),
        ].length > 0
      ) {
        [
          ...(req.files.left_drainase_images || []),
          ...(req.files.right_drainase_images || []),
        ].map((file) =>
          ImageKit.upload(
            {
              file: file.buffer.toString("base64"),
              fileName: `${file.fieldname}_${file.originalname}`,
              useUniqueFileName: true,
            },
            async (err, docs) => {
              if (err) throw err;

              images.push({
                image_path: docs.filePath,
                image_name: docs.name,
                image_id: docs.fileId,
              });

              if (
                images.length ===
                [
                  ...(req.files.left_drainase_images || []),
                  ...(req.files.right_drainase_images || []),
                ].length
              ) {
                const rightImages = images.filter(
                  (image) => image.image_name.split("_")[0] !== "left"
                );

                const leftImages = images.filter(
                  (image) => image.image_name.split("_")[0] !== "right"
                );

                await prisma.gis_drainase.update({
                  where: {
                    id: +req.params.id,
                  },
                  data: requestBody({ rightImages, leftImages }),
                });

                return res.status(201).json({
                  success: true,
                  message: "Drainase berhasil diperbarui",
                });
              }
            }
          )
        );
      } else {
        const data = requestBody({ rightImages: [], leftImages: [] });

        delete data.left_images_drainase;
        delete data.right_images_drainase;

        await prisma.gis_drainase.update({
          where: {
            id: +req.params.id,
          },
          data,
        });

        return res.status(200).json({
          success: true,
          message: "Drainase berhasil diperbarui",
        });
      }
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  active = async (req, res) => {
    try {
      await prisma.gis_drainase.update({
        where: {
          id: +req.params.id,
        },
        data: {
          is_published: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Berhasil mengaktifkan drainase",
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  softDelete = async (req, res) => {
    try {
      await prisma.gis_drainase.update({
        where: {
          id: +req.params.id,
        },
        data: {
          is_published: false,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Drainase berhasil dijadikan draft",
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  deleteLeftImage = async (req, res) => {
    try {
      const imageToDelete = await prisma.gis_left_images_drainase.findUnique({
        where: {
          id: +req.params.idImage,
        },
      });

      ImageKit.deleteFile(imageToDelete.image_id, async (err) => {
        if (err) throw err;

        await prisma.gis_left_images_drainase.delete({
          where: {
            id: +req.params.idImage,
          },
        });

        return res.status(200).json({
          success: true,
          message: "Gambar berhasil dihapus",
        });
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  deleteRightImage = async (req, res) => {
    try {
      const imageToDelete = await prisma.gis_right_images_drainase.findUnique({
        where: {
          id: +req.params.idImage,
        },
      });

      ImageKit.deleteFile(imageToDelete.image_id, async (err) => {
        if (err) throw err;

        await prisma.gis_right_images_drainase.delete({
          where: {
            id: +req.params.idImage,
          },
        });

        return res.status(200).json({
          success: true,
          message: "Gambar berhasil dihapus",
        });
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  delete = async (req, res) => {
    try {
      const leftImages = await prisma.gis_left_images_drainase.findMany({
        where: {
          drainase_id: +req.params.id,
        },
      });

      const rightImages = await prisma.gis_right_images_drainase.findMany({
        where: {
          drainase_id: +req.params.id,
        },
      });

      await ImageKit.bulkDeleteFiles(
        [...leftImages, ...rightImages].map((image) => image.image_id),
        (err) => {
          if (err) ErrorHandler(res, err.message, 400);
        }
      );

      await prisma.gis_drainase.delete({
        where: {
          id: +req.params.id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Drainase berhasil dihapus",
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };
}
