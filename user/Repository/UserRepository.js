import User from "../Model/User.js";


const create = async (userObject) => {
    const userModel = new User(userObject);
    return await userModel.save();
}

const findByEmail = (email) => {
    return User.findOne({email: email}).exec();
}

const findByEmailAndPassword = async (email, password) => {
    console.log({email: email, password: password});
    return await User.findOne({email: email, password: password}).exec();
}


export {create, findByEmail, findByEmailAndPassword};