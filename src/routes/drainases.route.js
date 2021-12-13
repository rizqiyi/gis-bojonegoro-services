import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import DrainasesController from "../controllers/drainase/drainases.controller.js";

const drainase = new DrainasesController();
const route = Router();

route.post("/create", authMiddleware, drainase.create);

export default route;
