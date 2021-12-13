import Prisma from "@prisma/client";
import ErrorHandler from "../../helpers/error.helper.js";
import RolesSchema from "../../validations/roles.validations.js";

const prisma = new Prisma.PrismaClient();
const schema = new RolesSchema();

export default class Roles {
  create = async (req, res) => {
    try {
      const isNotValidate = schema.RolesValidationSchema.validate(req.body);

      if (isNotValidate.error)
        return ErrorHandler(res, isNotValidate.error.details[0].message, 400);

      const roleNameHasRegistered = await prisma.gis_role.findUnique({
        where: {
          role_name: req.body.role_name,
        },
      });

      if (roleNameHasRegistered)
        return ErrorHandler(res, "Role tidak boleh sama", 400);

      const data = await prisma.gis_role.create({
        data: {
          role_name: req.body.role_name,
        },
      });

      return res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      ErrorHandler(res, err, 400);
    }
  };
}
