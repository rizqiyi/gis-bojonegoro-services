import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import UserController from "../controllers/users/users.controller.js";
import multer from "multer";

const user = new UserController();
const route = Router();

// route.post("/register", user.create);
route.get("/", authMiddleware, user.getAll);
route.post("/login", user.login);
route.post(
  "/register",
  authMiddleware,
  roleMiddleware,
  multer().single("avatar"),
  user.create
);
route.put(
  "/update/me",
  authMiddleware,
  multer().single("avatar"),
  user.updateMe
);
route.get("/:id", authMiddleware, roleMiddleware, user.getByID);
route.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware,
  multer().single("avatar"),
  user.updateByID
);
// route.put("/update/me/pwd", authMiddleware, user.updateMyPassword);
route.put("/update-role", authMiddleware, roleMiddleware, user.updateRole);
route.delete("/delete/:id", authMiddleware, roleMiddleware, user.delete);

export default route;
