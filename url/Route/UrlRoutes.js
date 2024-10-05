import express from "express";
import { handleGetUrls, handleGetUrlById } from "../Controller/UrlController.js";


let urlRouter = express.Router();

urlRouter.get("/", (req, res) => {
    return handleGetUrls(req, res);
});

urlRouter.get("/:urlId", (req, res) => {
    return handleGetUrlById(req, res);
});

export default urlRouter;


