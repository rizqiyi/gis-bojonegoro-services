export const roleMiddleware = async (req, res, next) => {
  try {
    if (req.user.payload.role === "user") {
      throw new Error("User not allowed to create another user");
    }

    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
