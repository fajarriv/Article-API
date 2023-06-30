import { Router } from "express";
import { login, register } from "../controller/user";
import { body } from "express-validator";
import validate from "../middleware/validator";

const userRouter: Router = Router();

userRouter.post(
  "/signup",
  validate([
    body("email").exists().isString(),
    body("password").exists().isString(),
    body("username").exists().isString(),
    body("firstname").exists().isString(),
    body("lastname").exists().isString(),
  ]),
  register
);
userRouter.post(
  "/signin",
  validate([
    body("username").exists().isString(),
    body("password").exists().isString(),
  ]),
  login
);

export default userRouter;
