import express from "express";
import {handleCreateUser, handleLogin, requestPasswordReset, resetPassword, verifyEmail} from "../Controller/UserController.js";


let userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    return await handleCreateUser(req, res);
});

userRouter.post("/login", async (req, res) => {
    return await handleLogin(req, res);
});

userRouter.post("/reset_password", (req, res) => {

});

userRouter.post('/forgot-password', requestPasswordReset);
userRouter.post('/reset-password/:token', resetPassword);
userRouter.get('/verify-email/:token', verifyEmail);

export default userRouter;


