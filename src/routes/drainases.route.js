import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import DrainasesController from "../controllers/drainase/drainases.controller.js";
import multer from "multer";

const drainase = new DrainasesController();
const route = Router();

route.get("/", drainase.get);
route.get("/dashboard", drainase.getDashboardData);
route.get("/district", drainase.getDistrict);
route.post(
  "/create",
  authMiddleware,
  multer().fields([
    { name: "left_drainase_images", maxCount: 10 },
    { name: "right_drainase_images", maxCount: 10 },
  ]),
  drainase.create
);
route.get("/:id", drainase.getByID);
route.put(
  "/update/:id",
  authMiddleware,
  multer().fields([
    { name: "left_drainase_images", maxCount: 10 },
    { name: "right_drainase_images", maxCount: 10 },
  ]),
  drainase.update
);
route.put("/activate/:id", authMiddleware, drainase.active);
route.put("/deactive/:id", authMiddleware, drainase.softDelete);
route.delete(
  "/delete/left-image/:idImage",
  authMiddleware,
  drainase.deleteLeftImage
);
route.delete(
  "/delete/right-image/:idImage",
  authMiddleware,
  drainase.deleteRightImage
);
route.delete("/delete/:id", authMiddleware, drainase.delete);

export default route;
