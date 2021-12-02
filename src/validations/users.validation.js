import Joi from "joi";

export default class UsersValidation {
  RegisterValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    fullname: Joi.string().required().messages({
      "string.empty": `Nama lengkap tidak boleh kosong`,
      "any.required": `Nama lengkap harus diisi`,
    }),
    username: Joi.string().alphanum().min(3).max(30).required().messages({
      "string.empty": `Nama Pengguna tidak boleh kosong`,
      "string.min": `Nama Pengguna tidak boleh kurang dari {#limit} karakter`,
      "string.max": `Nama Pengguna tidak boleh lebih dari {#limit} karakter`,
      "any.required": `Nama Pengguna harus diisi`,
    }),
    password: Joi.string().required().messages({
      "string.empty": `Kata sandi tidak boleh kosong`,
      "any.required": `Kata sandi harus diisi`,
    }),
    passwordVerify: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({
        "any.required": "Ulangi kata sandi tidak boleh kosong",
        "any.only": "Kata sandi harus sama dengan kata sandi sebelumnya",
      }),
    role_name: Joi.string().required().messages({
      "string.empty": `Role tidak boleh kosong`,
      "any.required": `Role harus diisi`,
    }),
  });

  LoginValidationSchema = Joi.object({
    username: Joi.string().required().messages({
      "string.empty": `Nama pengguna tidak boleh kosong`,
      "any.required": `Nama pengguna harus diisi`,
    }),
    password: Joi.string().required().messages({
      "string.empty": `Kata sandi tidak boleh kosong`,
      "any.required": `Kata sandi harus diisi`,
    }),
  });
}
