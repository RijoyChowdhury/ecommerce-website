const createError = require('http-errors');
const { isObjectEmpty } = require('./shared-utils');

const getAllFactory = (ElementModel) => {
    return async (req, res, next) => {
        try {
            const data = await ElementModel.find();
            if (data.length === 0) {
                throw createError.NotFound('No data found.');
            }
            res.status(200).json({
                status: 'success',
                data,
            });
        } catch (err) {
            next(err);
        }
    }
}

const createFactory = (ElementModel) => {
    return async (req, res, next) => {
        try {
            const data = req.body;
            await ElementModel.create(data)
            res.status(200).json({
                status: 'success',
                message: 'Data created.',
            });
        } catch (err) {
            next(err);
        }
    }
}

const getByIdFactory = (ElementModel) => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = await ElementModel.findById(id);
            res.status(200).json({
                status: 'success',
                data,
            });
        } catch (err) {
            next(err);
        }
    }
}

const updateByIdFactory = (ElementModel) => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await ElementModel.findByIdAndUpdate(id, data);
            res.status(200).json({
                status: 'success',
                message: 'Details updated.',
            });
        } catch (err) {
            next(err);
        }
    }
}

const deleteByIdFactory = (ElementModel) => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            await ElementModel.findByIdAndDelete(id);
            res.status(200).json({
                status: 'success',
                message: 'Data deleted.',
            });
        } catch (err) {
            next(err);
        }
    }
}

const checkDataFactory = (ElementModel) => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = await ElementModel.findById(id) ?? {};
            if (isObjectEmpty(data)) {
                throw createError.NotFound('Data not found.');
            }
            next();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = { 
    getAllFactory, 
    createFactory, 
    getByIdFactory, 
    updateByIdFactory, 
    deleteByIdFactory, 
    checkDataFactory 
}