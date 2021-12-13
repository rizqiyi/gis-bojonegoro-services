import Prisma from "@prisma/client";
import bcrypt from "bcryptjs";
import ErrorHandler from "../../helpers/error.helper.js";
import createToken from "../../helpers/token.helper.js";
import UsersSchema from "../../validations/users.validation.js";

const prisma = new Prisma.PrismaClient();
const schema = new UsersSchema();

export default class Users {
  create = async (req, res) => {
    try {
      const isNotValidate = schema.RegisterValidationSchema.validate(req.body);

      if (isNotValidate.error)
        return ErrorHandler(res, isNotValidate.error.details[0].message, 400);

      const usernameHasRegistered = await prisma.gis_user.findUnique({
        where: {
          username: req.body.username,
        },
      });

      if (usernameHasRegistered)
        return ErrorHandler(res, "Nama pengguna sudah digunakan", 400);

      const roleData = await prisma.gis_role.findFirst({
        where: {
          role_name: req.body.role_name,
        },
      });

      if (!roleData) return ErrorHandler(res, "Role tidak ditemukan", 400);

      const salt = await bcrypt.genSalt(10);

      const passwordHash = await bcrypt.hash(req.body.password, salt);

      const data = await prisma.gis_user.create({
        data: {
          email: req.body.email,
          fullname: req.body.fullname,
          username: req.body.username,
          manage: req.body.manage,
          role_name: roleData.role_name,
          password: passwordHash,
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

  updateRole = async (req, res) => {
    try {
      const isNotValidate = schema.RegisterValidationSchema.validate(req.body);

      if (isNotValidate.error)
        return ErrorHandler(res, isNotValidate.error.details[0].message, 400);

      const usernameHasRegistered = await prisma.gis_user.findUnique({
        where: {
          username: req.body.username,
        },
      });

      if (!usernameHasRegistered)
        return ErrorHandler(res, "Pengguna tidak ditemukan", 400);

      const roleData = await prisma.gis_role.findFirst({
        where: {
          role_name: req.body.role_name,
        },
      });

      if (!roleData) return ErrorHandler(res, "Role tidak ditemukan", 400);

      const data = await prisma.gis_user.update({
        where: {
          username: usernameHasRegistered.username,
        },
        data: {
          email: req.body.email,
          fullname: req.body.fullname,
          username: req.body.username,
          manage: req.body.manage,
          role_name: roleData.role_name,
        },
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      ErrorHandler(res, err, 400);
    }
  };

  delete = async (req, res) => {
    try {
      const id = +req.params.id;

      const idExist = await prisma.gis_user.findUnique({
        where: {
          id,
        },
      });

      if (!idExist) return ErrorHandler(res, "Pengguna tidak ditemukan", 400);

      if (id === req.user.payload.id)
        return ErrorHandler(
          res,
          "Pengguna tidak dapat menghapus data diri sendiri",
          400
        );

      await prisma.gis_user.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Pengguna berhasil dihapus",
      });
    } catch (err) {
      ErrorHandler(res, err.message, 400);
    }
  };

  login = async (req, res) => {
    try {
      const isNotValidate = schema.LoginValidationSchema.validate(req.body);

      if (isNotValidate.error)
        return ErrorHandler(res, isNotValidate.error.details[0].message, 400);

      const findUser = await prisma.gis_user.findUnique({
        where: {
          username: req.body.username,
        },
      });

      if (!findUser) return ErrorHandler(res, "Pengguna tidak ditemukan", 400);

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        findUser.password
      );

      if (!isPasswordValid) return ErrorHandler(res, "Password salah", 400);

      res.cookie(
        "x-auth-token",
        createToken({ id: findUser.id, role: findUser.role_name }),
        {
          httpOnly: true,
          maxAge: 3 * 24 * 60 * 60,
        }
      );

      delete findUser.password;

      return res.status(200).json({
        success: true,
        data: findUser,
      });
    } catch (err) {
      ErrorHandler(res, err.message);
    }
  };
}
