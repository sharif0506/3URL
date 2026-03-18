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

        // Increment analytics fields
        url.visitCount = (url.visitCount || 0) + 1;
        url.lastVisited = new Date();
        await url.save();

        // Redirect to the original URL
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


const generateUniqueShortCode = async () => {
    return nanoid(10);
};

// Create a new URL
const handleCreateUrl = async (req, res) => {
    const { originalUrl, isFavorite } = req.body || {};

    if (!originalUrl || !validator.isURL(originalUrl)) {
        return res.status(400).send({ message: "Invalid URL" });
    }

    const markedAsFavorite = isFavorite === true;
    const status = "active";

    let shortCode;
    let url;

    try {
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            shortCode = await generateUniqueShortCode();

            try {
                url = await createUrl({
                    originalUrl,
                    shortCode,
                    status,
                    isFavorite: markedAsFavorite
                });

                break; // success
            } catch (error) {
                // Duplicate key error mongodb database
                if (error.code === 11000) {
                    console.log(`Short code collision detected: ${shortCode}, retrying...`);
                    attempts++;
                } else {
                    // for any other error
                    throw error;
                }
            }
        }

        if (!url) {
            return res.status(500).send({ message: "Could not create url with short code, try again later." });
        }

        return res.status(201).send(url);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const handleUpdateUrl = async (req, res) => {

    const {originalUrl, status, isFavorite} = req.body;
    const {urlId} = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(urlId)) {
        return res.status(400).send({message: 'Invalid ID format'});
    }

    if (!originalUrl || !validator.isURL(originalUrl)) {
        return res.status(400).send({message: 'Invalid URL'});
    }

    if (!status || !status.match(/^(active|inactive|expired)$/)) {
        return res.status(400).send({message: 'Invalid status'});
    }

    let markedAsFavorite = false;
    if (isFavorite === true) {
        markedAsFavorite = true;
    }

    const urlObject = {
        'originalUrl': originalUrl,
        'status': status,
        'isFavorite': markedAsFavorite
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