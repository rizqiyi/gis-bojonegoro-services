import ErrorHandler from "../helpers/error.helper.js";
import role from "../constant/role.js";

export const roleMiddleware = async (req, res, next) => {
  try {
    if (req.user.payload.role === role["admin"]) {
      throw new Error("You are not allowed to do this action");
    }

    next();
  } catch (err) {
    ErrorHandler(res, err.message, 400);
  }
};
