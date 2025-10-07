/*
backend/src/middleware/auth.js
JWT authentication middleware.
*/

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Missing authorization header' });
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Malformed authorization header' });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // { id, email, role }
        next();
    } catch (err) {
        logger.warn('JWT verification failed', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
}

function requireRole(role) {
    return function (req, res, next) {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        if (req.user.role !== role && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}

module.exports = { authMiddleware, requireRole };
