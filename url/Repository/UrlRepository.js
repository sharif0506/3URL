import Url from '../Model/Url.js';


const findAll = async () => {
    return await Url.find({}).exec();
};

const findById = async (urlId) => {
    return await Url.findById(urlId).exec();
}

const findByShortCode = async (shortCode) => {
    return await Url.findOne({shortCode: shortCode}).exec();
}

const create = async (url) => {
    const urlModel = new Url(url);
    return await urlModel.save();
}

const update = async (urlId, urlObject) => {
    return await Url.findOneAndUpdate(
        {_id: urlId},
        {originalUrl: urlObject.originalUrl, status: urlObject.status},
        {new: true, runValidators: true}
    ).exec();
}

const remove = async (urlId) => {
    return await Url.findByIdAndDelete(urlId).exec();
}


export {findAll, findById, create, update, remove, findByShortCode};