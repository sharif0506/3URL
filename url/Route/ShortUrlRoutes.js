import express from "express";
import {handleGetUrlByShortCode} from "../Controller/UrlController.js";


const shortUrlRouter = express.Router();

shortUrlRouter.get("/:shortCode", async (req, res) => {
    return await handleGetUrlByShortCode(req, res);
});


export default shortUrlRouter;
