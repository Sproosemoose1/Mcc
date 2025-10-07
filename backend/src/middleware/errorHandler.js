/*
backend/src/middleware/errorHandler.js
Centralized error handler for Express.
*/

const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    logger.error('Unhandled error: %o', err);
    res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;
