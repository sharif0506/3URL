import Url from '../Model/Url.js';


const findAll = async () => {
    return await Url.find({});
};

const findById = async (urlId) => {
  return await Url.findById(urlId);

}


export {findAll, findById};