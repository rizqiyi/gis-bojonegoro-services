import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import DrainasesController from "../controllers/drainase/drainases.controller.js";
import multer from "multer";

const drainase = new DrainasesController();
const route = Router();

route.get("/", drainase.get);
route.get("/:id", drainase.getByID);
route.post(
  "/create",
  authMiddleware,
  multer().array("images", 5),
  drainase.create
);
route.put(
  "/update/:id",
  authMiddleware,
  multer().array("images", 5),
  drainase.update
);
route.put("/activate/:id", authMiddleware, drainase.active);
route.put("/deactive/:id", authMiddleware, drainase.softDelete);
route.delete("/delete/image/:idImage", authMiddleware, drainase.deleteImage);
route.delete("/delete/:id", authMiddleware, drainase.delete);

export default route;
