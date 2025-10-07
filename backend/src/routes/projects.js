const Project = require('../models/Project');

router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.userId
    });

    await logActivity(req.user.userId, 'create', 'project', project.id, req.ip);

    const io = req.app.get('io');
    io.emit('project:created', project);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const project = await Project.update(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await logActivity(req.user.userId, 'update', 'project', project.id, req.ip);

    const io = req.app.get('io');
    io.emit('project:updated', project);

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
