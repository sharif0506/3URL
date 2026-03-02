import express from "express";
import {handleGetUrlByShortCode} from "../Controller/UrlController.js";


const shortUrlRouter = express.Router();

shortUrlRouter.get("/:shortCode", handleGetUrlByShortCode);

export default shortUrlRouter;
