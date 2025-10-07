const { authenticate, authorize } = require('../middleware/auth');
const Inspection = require('../models/Inspection');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/inspections/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Get all inspections
router.get('/', authenticate, async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      assignedTo: req.query.assignedTo,
      projectId: req.query.projectId,
      type: req.query.type,
      priority: req.query.priority
    };

    const inspections = await Inspection.findAll(filters);
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single inspection
router.get('/:id', authenticate, async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }
    res.json(inspection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create inspection
router.post('/', authenticate, async (req, res) => {
  try {
    const inspection = await Inspection.create({
      ...req.body,
      createdBy: req.user.userId
    });

    await logActivity(
      req.user.userId,
      'create',
      'inspection',
      inspection.id,
      req.ip
    );

    // Emit socket event
    const io = req.app.get('io');
    io.emit('inspection:created', inspection);

    res.status(201).json(inspection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inspection
router.put('/:id', authenticate, async (req, res) => {
  try {
    const inspection = await Inspection.update(req.params.id, req.body);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    await logActivity(
      req.user.userId,
      'update',
      'inspection',
      inspection.id,
      req.ip,
      req.body
    );

    // Emit socket event
    const io = req.app.get('io');
    io.emit('inspection:updated', inspection);

    res.json(inspection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete inspection
router.delete('/:id', authenticate, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const inspection = await Inspection.delete(req.params.id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    await logActivity(
      req.user.userId,
      'delete',
      'inspection',
      req.params.id,
      req.ip
    );

    const io = req.app.get('io');
    io.emit('inspection:deleted', { id: req.params.id });

    res.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload inspection photos
router.post('/:id/photos', authenticate, upload.array('photos', 10), async (req, res) => {
  try {
    const db = require('../database/connection');
    const photos = [];

    for (const file of req.files) {
      const result = await db.query(
        `INSERT INTO inspection_photos 
        (inspection_id, filename, file_path, file_size, mime_type, uploaded_by)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          req.params.id,
          file.originalname,
          file.path,
          file.size,
          file.mimetype,
          req.user.userId
        ]
      );
      photos.push(result.rows[0]);
    }

    const io = req.app.get('io');
    io.emit('inspection:photos-uploaded', { 
      inspectionId: req.params.id, 
      count: photos.length 
    });

    res.status(201).json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inspection statistics
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const stats = await Inspection.getStats(req.query);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
