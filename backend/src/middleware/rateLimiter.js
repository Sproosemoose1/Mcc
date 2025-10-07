/*
backend/src/middleware/rateLimiter.js
Simple rate limiting with express-rate-limit
*/

const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120, // limit each IP to 120 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = apiLimiter;
