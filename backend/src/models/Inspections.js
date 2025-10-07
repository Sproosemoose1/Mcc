/*
backend/src/models/Inspection.js
Core inspection model.
*/

const pool = require('../config/db');

const Inspection = {
    async create({ title, description, project_id, status = 'open', created_by }) {
        const res = await pool.query(
            `INSERT INTO inspections (title, description, project_id, status, created_by, created_at)
       VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
            [title, description, project_id, status, created_by]
        );
        return res.rows[0];
    },

    async getById(id) {
        const res = await pool.query('SELECT * FROM inspections WHERE id = $1', [id]);
        return res.rows[0];
    },

    async listByProject(project_id) {
        const res = await pool.query('SELECT * FROM inspections WHERE project_id = $1 ORDER BY created_at DESC', [project_id]);
        return res.rows;
    },

    async updateStatus(id, status) {
        const res = await pool.query('UPDATE inspections SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *', [id, status]);
        return res.rows[0];
    },

    async addPhoto(id, url, uploaded_by) {
        const res = await pool.query(
            `INSERT INTO photos (inspection_id, url, uploaded_by, uploaded_at) VALUES ($1,$2,$3,NOW()) RETURNING *`,
            [id, url, uploaded_by]
        );
        return res.rows[0];
    },

    // Additional methods: comments, checklist items, time entries...
};

module.exports = Inspection;
