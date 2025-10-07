/*
backend/src/services/pdfService.js
Generates a simple PDF report for a given inspection object using PDFKit.
*/

const PDFDocument = require('pdfkit');

function generateInspectionPdf(inspection, stream) {
    const doc = new PDFDocument();
    doc.pipe(stream);

    doc.fontSize(20).text('Inspection Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Title: ${inspection.title}`);
    doc.moveDown();
    doc.text(`Description: ${inspection.description || ''}`);
    doc.moveDown();
    doc.text(`Status: ${inspection.status}`);
    doc.moveDown();
    doc.text(`Project ID: ${inspection.project_id}`);
    doc.moveDown();
    doc.text(`Created by: ${inspection.created_by}`);
    doc.moveDown();
    doc.text(`Created at: ${inspection.created_at}`);
    doc.end();
}

module.exports = { generateInspectionPdf };
