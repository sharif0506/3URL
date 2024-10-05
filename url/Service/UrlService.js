import {findAll, findById} from "../Repository/UrlRepository.js";

const getAllUrls = async () => {
    return await findAll();
}

const getUrlById = async (urlId) => {
    return await findById(urlId);
}

export  {getAllUrls, getUrlById};

