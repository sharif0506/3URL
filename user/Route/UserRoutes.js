import express from "express";
import {handleCreateUser, handleLogin} from "../Controller/UserController.js";


let userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    return await handleCreateUser(req, res);
});

userRouter.post("/login", async (req, res) => {
    return await handleLogin(req, res);
});


userRouter.post("/forget_password", (req, res) => {

});


userRouter.post("/reset_password", (req, res) => {

});

export default userRouter;


