import { Router } from "express";
import UserController from "../controllers/users/users.controller.js";

const user = new UserController();
const route = Router();

route.post("/register", user.create);
route.post("/login", user.login);

export default route;
