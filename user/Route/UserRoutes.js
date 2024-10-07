import express from "express";

let userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send("Hello World");
});


export default userRouter;


