import Joi from "joi";

export default class DrainaseValidation {
  DrainaseValidationSchema = Joi.object({
    latitude: Joi.number().required().messages({
      "number.empty": `Latitude tidak boleh kosong`,
      "any.required": `Latitude harus diisi`,
    }),
    longitude: Joi.number().required().messages({
      "number.empty": `Longitude tidak boleh kosong`,
      "any.required": `Longitude harus diisi`,
    }),
    district: Joi.string().required().messages({
      "string.empty": `Kabupaten tidak boleh kosong`,
      "any.required": `Kabupaten harus diisi`,
    }),
    sub_district: Joi.string().required().messages({
      "string.empty": `Kecamatan tidak boleh kosong`,
      "any.required": `Kecamatan harus diisi`,
    }),
    street_name: Joi.string().required().messages({
      "string.empty": `Nama jalan tidak boleh kosong`,
      "any.required": `Nama jalan harus diisi`,
    }),
    street_width: Joi.number().required().messages({
      "number.empty": `Lebar jalan tidak boleh kosong`,
      "any.required": `Lebar jalan harus diisi`,
    }),
    // images: Joi.array()
    //   .items(
    //     Joi.object({
    //       image_path: Joi.string().required().messages({
    //         "string.empty": `Path gambar pada data gambar tidak boleh kosong`,
    //         "any.required": `Path gambar pada data gambar harus diisi`,
    //       }),
    //       image_name: Joi.string().required().messages({
    //         "string.empty": `Nama gambar pada data gambar tidak boleh kosong`,
    //         "any.required": `Nama gambar pada data gambar harus diisi`,
    //       }),
    //       drainase_id: Joi.number().required().messages({
    //         "number.empty": `ID Drainase pada data gambar tidak boleh kosong`,
    //         "any.required": `ID Drainase pada data gambar harus diisi`,
    //       }),
    //     }).required()
    //   )
    //   .required()
    //   .messages({
    //     "array.empty": `Data gambar tidak boleh kosong`,
    //     "any.required": `Data gambar harus diisi`,
    //     "array.min": `Data gambar tidak boleh kurang dari {#limit} karakter`,
    //   }),
    left_typical: Joi.string().required().messages({
      "string.empty": `Tipikal kiri tidak boleh kosong`,
      "any.required": `Tipikal kiri harus diisi`,
    }),
    left_drainase_depth: Joi.string().required().messages({
      "string.empty": `Kedalaman drainase kiri tidak boleh kosong`,
      "any.required": `Kedalaman drainase kiri harus diisi`,
    }),
    left_drainase_width: Joi.string().required().messages({
      "string.empty": `Lebar drainase kiri tidak boleh kosong`,
      "any.required": `Lebar drainase kiri harus diisi`,
    }),
    left_drainase_condition: Joi.string().required().messages({
      "string.empty": `Kondisi drainase kiri tidak boleh kosong`,
      "any.required": `Kondisi drainase kiri harus diisi`,
    }),
    right_typical: Joi.string().required().messages({
      "string.empty": `Tipikal kanan tidak boleh kosong`,
      "any.required": `Tipikal kanan harus diisi`,
    }),
    right_drainase_depth: Joi.string().required().messages({
      "string.empty": `Kedalaman drainase kanan tidak boleh kosong`,
      "any.required": `Kedalaman drainase kanan harus diisi`,
    }),
    right_drainase_width: Joi.string().required().messages({
      "string.empty": `Lebar drainase kanan tidak boleh kosong`,
      "any.required": `Lebar drainase kanan harus diisi`,
    }),
    right_drainase_condition: Joi.string().required().messages({
      "string.empty": `Kondisi drainase kanan tidak boleh kosong`,
      "any.required": `Kondisi drainase kanan harus diisi`,
    }),
    note: Joi.string().required().messages({
      "string.empty": `Catatan tidak boleh kosong`,
      "any.required": `Catatan harus diisi`,
    }),
    description: Joi.string().required().messages({
      "string.empty": `Deskripsi tidak boleh kosong`,
      "any.required": `Deskripsi harus diisi`,
    }),
    sta: Joi.string().required().messages({
      "string.empty": `STA tidak boleh kosong`,
      "any.required": `STA harus diisi`,
    }),
    // street_path: Joi.string().required().messages({
    //   "string.empty": `Jalur tidak boleh kosong`,
    //   "any.required": `Jalur harus diisi`,
    // }),
    is_published: Joi.boolean().required().messages({
      "string.empty": `Status tidak boleh kosong`,
      "any.required": `Status harus diisi`,
    }),
    user_id: Joi.number().required().messages({
      "number.empty": `ID Pengguna tidak boleh kosong`,
      "any.required": `ID Pengguna harus diisi`,
    }),
  });
}
