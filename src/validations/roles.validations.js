import Joi from "joi";

export default class RolesValidation {
  RolesValidationSchema = Joi.object({
    role_name: Joi.string().min(3).max(30).required().messages({
      "string.empty": `Role tidak boleh kosong`,
      "any.required": `Role harus diisi`,
    }),
  });
}
