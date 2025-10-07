/*
database/seed.js
Seeds a default admin user and a sample project + inspection
Usage: node database/seed.js
*/

require('dotenv').config();
const pool = require('../backend/src/config/db');
const bcrypt = require('bcrypt');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

async function seed() {
    try {
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const client = await pool.connect();

        // create admin if not exists
        const res = await client.query('SELECT id FROM users WHERE email = $1', [ADMIN_EMAIL]);
        let adminId;
        if (res.rowCount === 0) {
            const r = await client.query('INSERT INTO users (email, password_hash, name, role) VALUES ($1,$2,$3,$4) RETURNING id', [ADMIN_EMAIL, hashed, 'Admin', 'admin']);
            adminId = r.rows[0].id;
            console.log('Created admin user', ADMIN_EMAIL);
        } else {
            adminId = res.rows[0].id;
            console.log('Admin already exists, id=', adminId);
        }

        // create sample project
        const pRes = await client.query('INSERT INTO projects (name, description, owner_id) VALUES ($1,$2,$3) RETURNING id', ['Sample Project', 'Seeded sample project', adminId]);
        const projectId = pRes.rows[0].id;

        // create sample inspection
        await client.query('INSERT INTO inspections (title, description, project_id, status, created_by) VALUES ($1,$2,$3,$4,$5)', ['Sample Inspection', 'This is a seeded inspection', projectId, 'open', adminId]);

        client.release();
        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed', err);
        process.exit(1);
    }
}

seed();
