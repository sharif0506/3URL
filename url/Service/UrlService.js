import {findAll, findById, create, update, remove} from "../Repository/UrlRepository.js";

const getAllUrls = async () => {
    return await findAll();
}

const getUrlById = async (urlId) => {
    return await findById(urlId);
}

const createUrl = async (url) => {
    return await create(url);
}

const updateUrl = async (urlId, urlObject) => {
    return await update(urlId, urlObject);
}

const deleteUrl = async (urlId) => {
    return await remove(urlId);
}


export {getAllUrls, getUrlById, createUrl, updateUrl, deleteUrl};
