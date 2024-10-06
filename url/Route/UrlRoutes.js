import express from "express";
import {
    handleGetUrls,
    handleGetUrlById,
    handleCreateUrl,
    handleUpdateUrl,
    handleDeleteUrl
} from "../Controller/UrlController.js";


let urlRouter = express.Router();

urlRouter.get("/", (req, res) => {
    return handleGetUrls(req, res);
});

urlRouter.get("/:urlId", (req, res) => {
    return handleGetUrlById(req, res);
});

urlRouter.post("/", (req, res) => {
    return handleCreateUrl(req, res);
});


urlRouter.put("/:urlId", (req, res) => {
    return handleUpdateUrl(req, res);
});


urlRouter.delete("/:urlId", (req, res) => {
    return handleDeleteUrl(req, res);
});

export default urlRouter;


