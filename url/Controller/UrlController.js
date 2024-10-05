import express from "express";
import {getAllUrls, getUrlById} from "../Service/UrlService.js";


// Get all URLs
const handleGetUrls = async (req, res) => {
    const urls = await getAllUrls();
    res.send(urls);
};

const handleGetUrlById = async (req, res) => {
    const {urlId} = req.params;
    const url = await getUrlById(urlId);
    res.send(url);
};

export { handleGetUrls, handleGetUrlById };