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

      const emailHasRegistered = await prisma.gis_user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (emailHasRegistered)
        return ErrorHandler(res, "Email sudah digunakan", 400);

      const salt = await bcrypt.genSalt(10);

      const passwordHash = await bcrypt.hash(req.body.password, salt);

      const data = await prisma.gis_user.create({
        data: {
          email: req.body.email,
          fullname: req.body.fullname,
          username: req.body.username,
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

  login = async (req, res) => {
    try {
      const isNotValidate = schema.LoginValidationSchema.validate(req.body);

      if (isNotValidate.error)
        return ErrorHandler(res, isNotValidate.error.details[0].message, 400);

      const findUser = await prisma.user.findFirst({
        where: {
          username: req.body.username,
        },
      });

      if (!findUser) return ErrorHandler(res, "Login gagal", 400);

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        findUser.password
      );

      if (!isPasswordValid) return ErrorHandler(res, "Password salah", 400);

      res.cookie("token", createToken(findUser.id), {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60,
      });

      return res.status(200).json({
        success: true,
        data: findUser,
      });
    } catch (err) {
      ErrorHandler(res, err);
    }
  };
}
