/*
backend/src/server.js
Main Express server with Socket.io, rate limiting, swagger, and routes.
*/

require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const logger = require('./utils/logger');
const apiLimiter = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const inspectionRoutes = require('./routes/inspections');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST', 'PATCH', 'PUT']
    },
    pingTimeout: 60000
});

// store io for routes to emit
app.locals.io = io;

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// apply api rate limiter
app.use('/api/', apiLimiter);

// Swagger UI
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.json'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// attach routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/analytics', analyticsRoutes);

// basic health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Socket.io events
io.on('connection', (socket) => {
    logger.info('Socket connected', socket.id);
    socket.on('joinProject', (projectId) => {
        socket.join(`project_${projectId}`);
    });

    socket.on('disconnect', () => {
        logger.info('Socket disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    logger.info(`Backend listening on port ${PORT}`);
});
