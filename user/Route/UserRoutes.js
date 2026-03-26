import express from "express";
import {
    handleCreateUser,
    handleLogin,
    forgetPassword,
    resetPassword,
    verifyEmail
} from "../Controller/UserController.js";
import {
    createUserSchema,
    loginUserSchema,
    userForgotPasswordSchema,
    userResetPasswordSchema
} from "../Schemas/user.schema.js";
import {validator} from "../Middleware/ValidationMiddleware.js";

let userRouter = express.Router();

userRouter.post("/register", validator(createUserSchema), handleCreateUser);

userRouter.post("/login", validator(loginUserSchema), handleLogin);

userRouter.post("/forgot-password", validator(userForgotPasswordSchema), forgetPassword);

userRouter.post('/reset-password/:token', validator(userResetPasswordSchema), resetPassword);

userRouter.get('/verify-email/:token', verifyEmail);

export default userRouter;
