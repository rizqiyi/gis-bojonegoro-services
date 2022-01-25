import Prisma from "@prisma/client";
import bcrypt from "bcryptjs";
import ErrorHandler from "../../helpers/error.helper.js";
import imagekit from "../../helpers/imagekit.helper.js";
import paginate from "../../helpers/paginate.helper.js";
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

      const file = req.file;

      if (file) {
        imagekit.upload(
          {
            file: file.buffer.toString("base64"),
            fileName: file.originalname,
            folder: "users",
            useUniqueFileName: true,
          },
          async (err, docs) => {
            if (err) throw err;

            const data = await prisma.gis_user.create({
              data: {
                avatar: docs.filePath,
                avatar_id: docs.fileId,
                email: req.body.email,
                fullname: req.body.fullname,
                username: req.body.username,
                manage: req.body.manage,
                role_name: roleData.role_name,
                password: passwordHash,
              },
            });

            delete data.password;

            return res.status(201).json({
              success: true,
              message: "Berhasil menambahkan pengguna",
              data,
            });
          }
        );
      } else {
        const data = await prisma.gis_user.create({
          data: {
            avatar: "default",
            avatar_id: "default",
            email: req.body.email,
            fullname: req.body.fullname,
            username: req.body.username,
            manage: req.body.manage,
            role_name: roleData.role_name,
            password: passwordHash,
          },
        });

        delete data.password;

        return res.status(201).json({
          success: true,
          message: "Berhasil menambahkan pengguna",
          data,
        });
      }
    } catch (err) {
      ErrorHandler(res, err, 400);
    }
  };

  getAll = async (req, res) => {
    try {
      // const page = parseInt(req.query.page ?? 1, 10);
      // const perPage = parseInt(req.query.perPage ?? 10, 10);

      // const offset = page * perPage - perPage;

      const users = await prisma.gis_user.findMany({
        // skip: offset,
        // take: perPage,
        where: {
          fullname: {
            search: req.query.q,
          },
        },
        select: {
          username: true,
          email: true,
          manage: true,
          fullname: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          id: true,
          role_name: true,
        },
      });

      // const data = await paginate(
      //   { count: users.length, rows:  },
      //   page,
      //   perPage
      // );

      return res.status(200).json({
        success: true,
        data: { data: users },
      });
    } catch (err) {
      ErrorHandler(res, err, 400);
    }
  };

  getByID = async (req, res) => {
    try {
      const user = await prisma.gis_user.findUnique({
        where: {
          id: +req.params.id,
        },
        select: {
          username: true,
          email: true,
          manage: true,
          fullname: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          id: true,
          role_name: true,
        },
      });

      return res.status(200).json({
        success: true,
        data: user,
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

      const token = createToken({
        id: findUser.id,
        role: findUser.role_name,
        street_path: findUser.manage,
      });

      res.cookie("x-auth-token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60,
      });

      delete findUser.password;

      return res.status(200).json({
        success: true,
        data: findUser,
        token,
      });
    } catch (err) {
      ErrorHandler(res, err.message);
    }
  };

  updateByID = async (req, res) => {
    try {
      // const isNotValidate = schema.ChangePasswordValidationSchema.validate(
      //   req.body
      // );

      // if (isNotValidate.error) {
      //   return ErrorHandler(res, isNotValidate.error.details[0].message, 400);
      // }

      const user = await prisma.gis_user.findUnique({
        where: {
          id: +req.params.id,
        },
      });

      if (!user) return ErrorHandler(res, "User tidak ditemukan", 404);

      const imageExist = req.file;

      const generatePassword = async (params) => {
        if (params.password) {
          const salt = await bcrypt.genSalt(10);

          const password = await bcrypt.hash(params.password, salt);

          return password;
        }

        return;
      };

      if (imageExist) {
        imagekit.upload(
          {
            file: imageExist.buffer.toString("base64"),
            fileName: imageExist.originalname,
            folder: "users",
            useUniqueFileName: true,
          },
          async (err, docs) => {
            if (err) throw err;

            const password = await generatePassword(req.body);

            await prisma.gis_user.update({
              where: {
                id: +req.params.id,
              },
              data: {
                avatar: docs.filePath,
                avatar_id: docs.fileId,
                email: req.body.email,
                fullname: req.body.fullname,
                username: req.body.username,
                manage: req.body.manage,
                role_name: req.body.role_name,
                ...(Boolean(req.body.password)
                  ? { password }
                  : { password: user.password }),
              },
            });

            imagekit.deleteFile(user.avatar_id);

            return res.status(200).json({
              success: true,
              message: "Data pengguna berhasil diperbarui",
            });
          }
        );
      } else {
        const password = await generatePassword(req.body);

        await prisma.gis_user.update({
          where: {
            id: +req.params.id,
          },
          data: {
            email: req.body.email,
            fullname: req.body.fullname,
            username: req.body.username,
            manage: req.body.manage,
            role_name: req.body.role_name,
            ...(Boolean(req.body.password)
              ? { password }
              : { password: user.password }),
          },
        });

        return res.status(200).json({
          success: true,
          message: "Data pengguna berhasil diperbarui",
        });
      }
    } catch (err) {
      ErrorHandler(res, err.message);
    }
  };

  updateMe = async (req, res) => {
    try {
      // const isNotValidate = schema.ChangePasswordValidationSchema.validate(
      //   req.body
      // );

      // if (isNotValidate.error) {
      //   return ErrorHandler(res, isNotValidate.error.details[0].message, 400);
      // }

      const user = await prisma.gis_user.findUnique({
        where: {
          id: +req.user.payload.id,
        },
      });

      if (!user) return ErrorHandler(res, "User tidak ditemukan", 404);

      const imageExist = req.file;

      const generatePassword = async (params) => {
        if (params.password) {
          const salt = await bcrypt.genSalt(10);

          const password = await bcrypt.hash(params.password, salt);

          return password;
        }

        return;
      };

      if (imageExist) {
        imagekit.upload(
          {
            file: imageExist.buffer.toString("base64"),
            fileName: imageExist.originalname,
            folder: "users",
            useUniqueFileName: true,
          },
          async (err, docs) => {
            if (err) throw err;

            const password = await generatePassword(req.body);

            await prisma.gis_user.update({
              where: {
                id: +req.user.payload.id,
              },
              data: {
                avatar: docs.filePath,
                avatar_id: docs.fileId,
                email: req.body.email,
                fullname: req.body.fullname,
                username: req.body.username,
                manage: req.body.manage,
                role_name: req.body.role_name,
                ...(Boolean(req.body.password)
                  ? { password }
                  : { password: user.password }),
              },
            });

            imagekit.deleteFile(user.avatar_id);

            return res.status(200).json({
              success: true,
              message: "Data pengguna berhasil diperbarui",
            });
          }
        );
      } else {
        const password = await generatePassword(req.body);

        await prisma.gis_user.update({
          where: {
            id: +req.user.payload.id,
          },
          data: {
            email: req.body.email,
            fullname: req.body.fullname,
            username: req.body.username,
            manage: req.body.manage,
            role_name: req.body.role_name,
            ...(Boolean(req.body.password)
              ? { password }
              : { password: user.password }),
          },
        });

        return res.status(200).json({
          success: true,
          message: "Data pengguna berhasil diperbarui",
        });
      }
    } catch (err) {
      ErrorHandler(res, err.message);
    }
  };

  updateMyPassword = async (req, res) => {
    try {
      const isNotValidate = schema.ChangeMyPasswordValidationSchema.validate(
        req.body
      );

      if (isNotValidate.error) {
        return ErrorHandler(res, isNotValidate.error.details[0].message, 400);
      }

      const user = await prisma.gis_user.findUnique({
        where: {
          id: +req.user.payload.id,
        },
      });

      if (!user) return ErrorHandler(res, "User tidak ditemukan", 404);

      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isPasswordMatch)
        return ErrorHandler(res, "Password lama salah", 400);

      const generatePassword = async (params) => {
        if (params.newPassword) {
          const salt = await bcrypt.genSalt(10);

          const password = await bcrypt.hash(params.newPassword, salt);

          return password;
        }

        return;
      };

      const password = await generatePassword(req.body);

      await prisma.gis_user.update({
        where: {
          id: +req.user.payload.id,
        },
        data: {
          email: req.body.email,
          fullname: req.body.fullname,
          username: req.body.username,
          manage: req.body.manage,
          role_name: req.body.role_name,
          password,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Password berhasil diperbarui",
      });
    } catch (err) {
      ErrorHandler(res, err.message);
    }
  };
}
