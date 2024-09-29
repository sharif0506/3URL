import express from "express";
import Url from "../Model/Url.js";


// Get all URLs
const getUrls = async (req, res) => {
    try {
        const urls = await Url.find(); // Fetch all URLs from the database
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ message: "Error fetching URLs", error: error.message });
    }
};

// Get URL by ID
const getUrlById = async (req, res) => {
    try {
        const url = await Url.findById(req.params.id); // Find URL by MongoDB ID
        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }
        res.status(200).json(url);
    } catch (error) {
        res.status(500).json({ message: "Error fetching URL", error: error.message });
    }
};

// Create a new shortened URL
const createUrl = async (req, res) => {
    const { originalUrl, shortUrl } = req.body; // Expecting originalUrl and shortUrl in the request body

    if (!originalUrl || !shortUrl) {
        return res.status(400).json({ message: "Original URL and short URL are required" });
    }

    try {
        const newUrl = new Url({ originalUrl, shortUrl }); // Create a new instance of the Url model
        await newUrl.save(); // Save it to the database
        res.status(201).json(newUrl); // Respond with the created resource
    } catch (error) {
        res.status(500).json({ message: "Error creating URL", error: error.message });
    }
};

// Update an existing URL
const updateUrl = async (req, res) => {
    const { id } = req.params;
    const { originalUrl, shortUrl } = req.body;

    if (!originalUrl && !shortUrl) {
        return res.status(400).json({ message: "At least one of originalUrl or shortUrl is required" });
    }

    try {
        const updatedUrl = await Url.findByIdAndUpdate(
            id,
            { originalUrl, shortUrl },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedUrl) {
            return res.status(404).json({ message: "URL not found" });
        }

        res.status(200).json(updatedUrl);
    } catch (error) {
        res.status(500).json({ message: "Error updating URL", error: error.message });
    }
};

// Delete a URL
const deleteUrl = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUrl = await Url.findByIdAndDelete(id); // Find and delete URL by ID
        if (!deletedUrl) {
            return res.status(404).json({ message: "URL not found" });
        }

        res.status(200).json({ message: "URL deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting URL", error: error.message });
    }
};

export { getUrls, getUrlById, createUrl, updateUrl, deleteUrl };