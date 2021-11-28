import jwt from "jsonwebtoken";

export default (payload) => {
  return jwt.sign(
    {
      id: payload,
    },
    process.env.JWT_SECRET,
    { expiresIn: 3600 * 24 * 7 }
  );
};
