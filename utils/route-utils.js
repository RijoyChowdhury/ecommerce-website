const { isObjectEmpty } = require('./shared-utils');

const checkRequestBody = (req, res, next) => {
    try {
        if (isObjectEmpty(req.body)) {
            throw createError.BadRequest('Bad payload.');
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { checkRequestBody }