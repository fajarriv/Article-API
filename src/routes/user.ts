import { Router } from "express";
import { login, register } from "../controller/user";

const userRouter: Router = Router();

userRouter.post("/signup", register);
userRouter.post("/signin", login);


export default userRouter;