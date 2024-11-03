const UserModel = require('../models/user');
const { 
    getAllFactory, 
    createFactory, 
    getByIdFactory, 
    updateByIdFactory, 
    deleteByIdFactory, 
    checkDataFactory 
} = require('../utils/crud-factory');

const checkUserDataPresent = checkDataFactory(UserModel);
const getAllUsersHandler = getAllFactory(UserModel);
const createUserHandler = createFactory(UserModel);
const getUserByIdHandler = getByIdFactory(UserModel);
const updateUserByIdHandler = updateByIdFactory(UserModel);
const deleteUserByIdHandler = deleteByIdFactory(UserModel);

module.exports = {
    checkUserDataPresent,
    getAllUsersHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler
}