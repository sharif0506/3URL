import {create, findByEmail, findByEmailAndPassword} from "../Repository/UserRepository.js";


const createUser = async (userObject) => {
    return await create(userObject);
}

const findUserByEmail = async (email) => {
    return await findByEmail(email);
}

const findUserByEmailAndPassword = async (email, password) => {
    return await findByEmailAndPassword(email, password);
}

export {createUser, findUserByEmail, findUserByEmailAndPassword}