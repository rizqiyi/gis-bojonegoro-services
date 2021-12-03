import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import users from "./src/routes/users.route.js";

dotenv.config(".env");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", users);

app.get("/", (_, res) =>
  res.send("you can call me rizqi, is there anything i can help you with?")
);

app.listen(PORT, () => console.log(`server up on port ${PORT}.`));
