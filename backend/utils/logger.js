/*
backend/src/utils/logger.js
Winston logger simple wrapper used by the backend.
*/

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console()
    ]
});

module.exports = logger;
