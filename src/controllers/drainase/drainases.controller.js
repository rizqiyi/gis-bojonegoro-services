import Prisma from "@prisma/client";
import ErrorHandler from "../../helpers/error.helper.js";
import DrainasesSchema from "../../validations/drainases.validations.js";

const prisma = new Prisma.PrismaClient();
const schema = new DrainasesSchema();

export default class Drainases {
  create = async (req, res) => {
    try {
      const isValidate = schema.DrainaseValidationSchema.validate(req.body);

      if (isValidate.error)
        return ErrorHandler(res, isValidate.error.details[0].message, 400);

      await prisma.gis_drainase.create({
        data: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          district: req.body.district,
          sub_district: req.body.sub_district,
          street_name: req.body.street_name,
          street_width: req.body.street_width,
          sta: req.body.sta,
          street_path: req.user.payload.street_path,
          images: {
            create: req.body.images,
          },
          left_typical: req.body.left_typical,
          left_drainase_depth: req.body.left_drainase_depth,
          left_drainase_width: req.body.left_drainase_width,
          left_drainase_condiiton: req.body.left_drainase_condiiton,
          right_typical: req.body.right_typical,
          right_drainase_depth: req.body.right_drainase_depth,
          right_drainase_width: req.body.right_drainase_width,
          right_drainase_condiiton: req.body.right_drainase_condiiton,
          note: req.body.note,
          description: req.body.description,
          is_published: req.body.is_published,
          user_id: req.user.payload.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Drainase berhasil ditambahkan",
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };
}
