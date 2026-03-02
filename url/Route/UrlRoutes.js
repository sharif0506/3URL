import express from "express";
import {
    handleGetUrls,
    handleGetUrlById,
    handleCreateUrl,
    handleUpdateUrl,
    handleDeleteUrl
} from "../Controller/UrlController.js";
import {authenticateJWT} from "../../middleware/authMiddleware.js";


let urlRouter = express.Router();

urlRouter.use(authenticateJWT);

urlRouter.get("/", handleGetUrls);
urlRouter.get("/:urlId", handleGetUrlById);
urlRouter.post("/", handleCreateUrl);
urlRouter.put("/:urlId", handleUpdateUrl);
urlRouter.delete("/:urlId", handleDeleteUrl);

export default urlRouter;


