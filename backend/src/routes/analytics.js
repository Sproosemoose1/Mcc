const db = require('../database/connection');

router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const { projectId, startDate, endDate } = req.query;

    // Total inspections by status
    let statusQuery = `
      SELECT status, COUNT(*) as count
      FROM inspections
      WHERE 1=1
    `;
    const statusParams = [];
    let paramCount = 1;

    if (projectId) {
      statusQuery += ` AND project_id = $${paramCount}`;
      statusParams.push(projectId);
      paramCount++;
    }

    statusQuery += ` GROUP BY status`;
    const statusResult = await db.query(statusQuery, statusParams);

    // Inspections by type
    const typeQuery = `
      SELECT type, COUNT(*) as count
      FROM inspections
      WHERE 1=1 ${projectId ? 'AND project_id = $1' : ''}
      GROUP BY type
    `;
    const typeResult = await db.query(typeQuery, projectId ? [projectId] : []);

    // Team performance
    const teamQuery = `
      SELECT 
        u.id, u.name,
        COUNT(i.id) as total_inspections,
        COUNT(CASE WHEN i.status = 'completed' THEN 1 END) as completed_inspections,
        SUM(i.actual_hours) as total_hours,
        SUM(i.estimated_hours) as estimated_hours
      FROM users u
      LEFT JOIN inspections i ON u.id = i.assigned_to
      WHERE u.role IN ('engineer', 'inspector')
      GROUP BY u.id, u.name
    `;
    const teamResult = await db.query(teamQuery);

    // Weekly progress
    const weeklyQuery = `
      SELECT 
        DATE_TRUNC('day', scheduled_date) as day,
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM inspections
      WHERE scheduled_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY day
      ORDER BY day
    `;
    const weeklyResult = await db.query(weeklyQuery);

    res.json({
      byStatus: statusResult.rows,
      byType: typeResult.rows,
      teamPerformance: teamResult.rows,
      weeklyProgress: weeklyResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/time-tracking', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT 
        u.name,
        COUNT(DISTINCT i.id) as inspection_count,
        SUM(i.actual_hours) as total_hours,
        AVG(i.actual_hours) as avg_hours,
        SUM(CASE WHEN i.actual_hours > i.estimated_hours THEN 1 ELSE 0 END) as over_estimate
      FROM inspections i
      JOIN users u ON i.assigned_to = u.id
      WHERE i.status = 'completed'
      GROUP BY u.id, u.name
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
