import ErrorHandler from "../helpers/error.helper.js";

export const roleMiddleware = async (req, res, next) => {
  try {
    if (req.user.payload.role === "user") {
      throw new Error("User not allowed to create another user");
    }

    next();
  } catch (err) {
    ErrorHandler(res, err, 400);
  }
};
