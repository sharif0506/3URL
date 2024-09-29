import express from "express";

let urlRouter = express.Router();

urlRouter.get("/", (req, res) => {
    res.send("Hello World");
});


export default urlRouter;


