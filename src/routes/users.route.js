import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import UserController from "../controllers/users/users.controller.js";

const user = new UserController();
const route = Router();

// route.post("/register", user.create);
route.post("/login", user.login);
route.post("/register", authMiddleware, roleMiddleware, user.create);
route.put("/update-role", authMiddleware, roleMiddleware, user.updateRole);

export default route;
