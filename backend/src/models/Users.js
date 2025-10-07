/*
backend/src/models/User.js
Minimal user model layer using raw SQL via pg Pool.
For a bigger project you could swap this for an ORM (Objection/Sequelize/Drizzle)
*/

const pool = require('../config/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const User = {
    async create({ email, password, name, role = 'user' }) {
        const client = await pool.connect();
        try {
            const hashed = await bcrypt.hash(password, SALT_ROUNDS);
            const result = await client.query(
                `INSERT INTO users (email, password_hash, name, role, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id, email, name, role, created_at`,
                [email, hashed, name, role]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    },

    async findByEmail(email) {
        const res = await pool.query('SELECT id, email, password_hash, name, role FROM users WHERE email = $1', [email]);
        return res.rows[0];
    },

    async findById(id) {
        const res = await pool.query('SELECT id, email, name, role, created_at FROM users WHERE id = $1', [id]);
        return res.rows[0];
    },

    async list() {
        const res = await pool.query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
        return res.rows;
    },

    async updatePassword(id, newPassword) {
        const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, id]);
        return true;
    },

    // More CRUD operations as needed...
};

module.exports = User;
