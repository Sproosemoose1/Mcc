const PDFDocument = require('pdfkit');
const fs = require('fs');

router.get('/inspection/:id/pdf', authenticate, async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    // Get photos
    const photosQuery = await db.query(
      'SELECT * FROM inspection_photos WHERE inspection_id = $1',
      [req.params.id]
    );

    // Create PDF
    const doc = new PDFDocument();
    const filename = `inspection-${req.params.id}-${Date.now()}.pdf`;
    const filepath = path.join('uploads', 'reports', filename);

    doc.pipe(fs.createWriteStream(filepath));
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Inspection Report', { align: 'center' });
    doc.moveDown();

    // Inspection Details
    doc.fontSize(12);
    doc.text(`Title: ${inspection.title}`);
    doc.text(`Project: ${inspection.project_name}`);
    doc.text(`Report Number: ${inspection.report_number}`);
    doc.text(`Mail Number: ${inspection.mail_number}`);
    doc.text(`Type: ${inspection.type}`);
    doc.text(`Status: ${inspection.status}`);
    doc.text(`Priority: ${inspection.priority}`);
    doc.text(`Assigned To: ${inspection.assigned_to_name}`);
    doc.text(`Scheduled: ${inspection.scheduled_date} at ${inspection.scheduled_time}`);
    doc.text(`Location: ${inspection.location}`);
    doc.moveDown();

    doc.text(`Description:`);
    doc.text(inspection.description || 'N/A');
    doc.moveDown();

    if (inspection.findings) {
      doc.text(`Findings:`);
      doc.text(inspection.findings);
      doc.moveDown();
    }

    if (inspection.recommendations) {
      doc.text(`Recommendations:`);
      doc.text(inspection.recommendations);
      doc.moveDown();
    }

    doc.text(`Time Tracking:`);
    doc.text(`Estimated: ${inspection.estimated_hours}h | Actual: ${inspection.actual_hours}h`);
    doc.moveDown();

    doc.text(`Photos: ${photosQuery.rows.length} attached`);

    doc.end();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
