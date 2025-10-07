/*
backend/src/routes/inspections.js
Routes to create/list/update inspections and upload photos.
*/

const express = require('express');
const multer = require('multer');
const Inspection = require('../models/Inspection');
const { authMiddleware } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// configure multer disk storage (in production use S3 or similar)
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB limit

// create inspection
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { title, description, project_id } = req.body;
        const created = await Inspection.create({ title, description, project_id, created_by: req.user.id });
        // emit via socket.io (attached to req.app.locals.io)
        if (req.app.locals.io) req.app.locals.io.emit('inspection:created', created);
        res.json({ inspection: created });
    } catch (err) { next(err); }
});

// list by project
router.get('/project/:projectId', authMiddleware, async (req, res, next) => {
    try {
        const list = await Inspection.listByProject(req.params.projectId);
        res.json({ inspections: list });
    } catch (err) { next(err); }
});

// upload photo
router.post('/:id/photos', authMiddleware, upload.single('photo'), async (req, res, next) => {
    try {
        const inspectionId = req.params.id;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const url = `/uploads/${req.file.filename}`;
        const photo = await Inspection.addPhoto(inspectionId, url, req.user.id);
        if (req.app.locals.io) req.app.locals.io.emit('inspection:photo', { inspectionId, photo });
        res.json({ photo });
    } catch (err) { next(err); }
});

// update status
router.patch('/:id/status', authMiddleware, async (req, res, next) => {
    try {
        const { status } = req.body;
        const updated = await Inspection.updateStatus(req.params.id, status);
        if (req.app.locals.io) req.app.locals.io.emit('inspection:updated', updated);
        res.json({ inspection: updated });
    } catch (err) { next(err); }
});

module.exports = router;
