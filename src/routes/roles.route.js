import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import RolesController from "../controllers/roles/roles.controller.js";

const role = new RolesController();
const route = Router();

route.post("/create", authMiddleware, roleMiddleware, role.create);

export default route;
