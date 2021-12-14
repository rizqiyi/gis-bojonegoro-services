import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import DrainasesController from "../controllers/drainase/drainases.controller.js";
import multer from "multer";

const drainase = new DrainasesController();
const route = Router();

route.get("/", authMiddleware, drainase.get);
route.post(
  "/create",
  authMiddleware,
  multer().array("images", 5),
  drainase.create
);

export default route;
