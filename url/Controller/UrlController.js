import {getAllUrls, getUrlById, createUrl, updateUrl, deleteUrl, getUrlByShortCode} from "../Service/UrlService.js";
import {nanoid} from 'nanoid';
import validator from "validator";


const handleGetUrlByShortCode = async (req, res) => {
    try {
        const {shortCode} = req.params;

        if (shortCode.length !== 10) {
            return res.status(400).send({message: 'Invalid short code'});
        }
        const url = await getUrlByShortCode(shortCode);
        if (!url) return res.status(404).send({message: 'Url Not Found'});
        return res.redirect(url.originalUrl);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message: "Internal Server Error"});
    }
}

const handleGetUrls = async (req, res) => {
    try {
        const urls = await getAllUrls();
        return res.status(200).send(urls);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message: "Internal Server Error"});
    }
};

const handleGetUrlById = async (req, res) => {

    try {
        const {urlId} = req.params;

        if (!/^[0-9a-fA-F]{24}$/.test(urlId)) {
            return res.status(400).send({message: 'Invalid ID format'});
        }

        const url = await getUrlById(urlId);

        if (!url) return res.status(404).send({message: 'Url Not Found'});
        return res.status(200).send(url);

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message: "Internal Server Error"});
    }
};


// Create a new URL
const handleCreateUrl = async (req, res) => {
    const {originalUrl} = req.body;

    if (!validator.isURL(originalUrl)) {
        return res.status(400).send({message: 'Invalid URL'});
    }

    const shortCode = nanoid(10);
    const status = 'active';

    const urlObject = {
        'originalUrl': originalUrl,
        'shortCode': shortCode,
        'status': status
    };

    try {
        const url = await createUrl(urlObject);
        return res.status(201).send(url);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message: "Internal Server Error"});
    }

};

const handleUpdateUrl = async (req, res) => {

    const {originalUrl, status} = req.body;
    const {urlId} = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(urlId)) {
        return res.status(400).send({message: 'Invalid ID format'});
    }

    if (!validator.isURL(originalUrl)) {
        return res.status(400).send({message: 'Invalid URL'});
    }

    if (!status || !status.match(/^(active|inactive|expired)$/)) {
        return res.status(400).send({message: 'Invalid status'});
    }

    const urlObject = {
        'originalUrl': originalUrl,
        'status': status
    };

    try {
        const url = await updateUrl(urlId, urlObject);
        return res.status(200).send(url);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message: "Internal Server Error"});
    }

}

const handleDeleteUrl = async (req, res) => {
    const {urlId} = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(urlId)) {
        return res.status(400).send({message: 'Invalid ID format'});
    }

    try {
        const url = await deleteUrl(urlId);
        res.status(200).json({message: "URL deleted successfully"});

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message: "Internal Server Error"});
    }
}


export {handleGetUrls, handleGetUrlById, handleCreateUrl, handleUpdateUrl, handleDeleteUrl, handleGetUrlByShortCode};