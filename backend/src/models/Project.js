/*
backend/src/models/Project.js
Project model with basic CRUD using pg Pool.
*/

const pool = require('../config/db');

const Project = {
    async create({ name, description, owner_id }) {
        const res = await pool.query(
            `INSERT INTO projects (name, description, owner_id, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
            [name, description, owner_id]
        );
        return res.rows[0];
    },

    async getById(id) {
        const res = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
        return res.rows[0];
    },

    async list() {
        const res = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        return res.rows;
    },

    async update(id, fields) {
        // simplistic update using text replacement; in production use parameterized dynamic queries
        const sets = [];
        const values = [];
        let idx = 1;
        for (const key in fields) {
            sets.push(`${key} = $${idx++}`);
            values.push(fields[key]);
        }
        if (values.length === 0) return this.getById(id);
        values.push(id);
        const query = `UPDATE projects SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`;
        const res = await pool.query(query, values);
        return res.rows[0];
    }
};

module.exports = Project;
