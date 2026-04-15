const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Setup Database and Table
async function initDB() {
    try {
        // Create DB if not exists (using a temporary connection without database)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        }).promise();
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        await connection.end();

        // Create table with all form fields
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                guests INT NOT NULL,
                checkInDate DATE NOT NULL,
                company VARCHAR(255) DEFAULT NULL,
                role VARCHAR(100) DEFAULT NULL,
                useCase VARCHAR(500) DEFAULT NULL,
                teamSize VARCHAR(50) DEFAULT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        await promisePool.query(createTableQuery);

        // Add new columns if they don't exist (for existing tables)
        const alterQueries = [
            "ALTER TABLE bookings ADD COLUMN company VARCHAR(255) DEFAULT NULL",
            "ALTER TABLE bookings ADD COLUMN role VARCHAR(100) DEFAULT NULL",
            "ALTER TABLE bookings ADD COLUMN useCase VARCHAR(500) DEFAULT NULL",
            "ALTER TABLE bookings ADD COLUMN teamSize VARCHAR(50) DEFAULT NULL",
            "ALTER TABLE bookings ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'",
            "ALTER TABLE bookings ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ];
        for (const q of alterQueries) {
            try { await promisePool.query(q); } catch (e) { 
                if (e.code !== 'ER_DUP_FIELDNAME') {
                    console.error('Alter table error:', e.message);
                }
            }
        }

        console.log('Database and bookings table are ready (with CRUD support).');
    } catch (err) {
        console.error('Database setup error:', err);
    }
}

initDB();

// ═══════════════════════════════════════════
// ██  CRUD API Endpoints  ██
// ═══════════════════════════════════════════

// CREATE — Submit a new booking / application
app.post('/api/bookings', async (req, res) => {
    try {
        const { name, email, phone, guests, checkInDate, company, role, useCase, teamSize } = req.body;

        // Basic validation
        if (!name || !email || !guests || !checkInDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const [result] = await promisePool.query(
            'INSERT INTO bookings (name, email, phone, guests, checkInDate, company, role, useCase, teamSize) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, phone || null, guests, checkInDate, company || null, role || null, useCase || null, teamSize || null]
        );

        res.status(201).json({ message: 'Booking successful!', bookingId: result.insertId });
    } catch (err) {
        console.error('Error saving booking:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// READ — Get all bookings (with optional search & sort)
app.get('/api/bookings', async (req, res) => {
    try {
        const { search, sortBy = 'createdAt', order = 'DESC', status } = req.query;
        
        let query = 'SELECT * FROM bookings WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        if (status && status !== 'all') {
            query += ' AND status = ?';
            params.push(status);
        }

        // Whitelist sortable columns to prevent SQL injection
        const allowedSortColumns = ['id', 'name', 'email', 'company', 'createdAt', 'updatedAt', 'status'];
        const safeSort = allowedSortColumns.includes(sortBy) ? sortBy : 'createdAt';
        const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        query += ` ORDER BY ${safeSort} ${safeOrder}`;

        const [rows] = await promisePool.query(query, params);
        res.json({ bookings: rows, total: rows.length });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// READ — Get a single booking by ID
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching booking:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE — Edit a booking by ID
app.put('/api/bookings/:id', async (req, res) => {
    try {
        const { name, email, phone, guests, checkInDate, company, role, useCase, teamSize, status } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const [result] = await promisePool.query(
            `UPDATE bookings SET name = ?, email = ?, phone = ?, guests = ?, checkInDate = ?, 
             company = ?, role = ?, useCase = ?, teamSize = ?, status = ?
             WHERE id = ?`,
            [name, email, phone || null, guests || 1, checkInDate || new Date().toISOString().split('T')[0], 
             company || null, role || null, useCase || null, teamSize || null, status || 'pending', req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ message: 'Booking updated successfully!' });
    } catch (err) {
        console.error('Error updating booking:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE — Remove a booking by ID
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ message: 'Booking deleted successfully!' });
    } catch (err) {
        console.error('Error deleting booking:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE — Bulk delete bookings
app.post('/api/bookings/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'No IDs provided' });
        }

        const placeholders = ids.map(() => '?').join(',');
        const [result] = await promisePool.query(`DELETE FROM bookings WHERE id IN (${placeholders})`, ids);

        res.json({ message: `${result.affectedRows} booking(s) deleted successfully!`, deleted: result.affectedRows });
    } catch (err) {
        console.error('Error in bulk delete:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE — Bulk status update
app.post('/api/bookings/bulk-status', async (req, res) => {
    try {
        const { ids, status } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
            return res.status(400).json({ error: 'IDs and status are required' });
        }

        const placeholders = ids.map(() => '?').join(',');
        const [result] = await promisePool.query(
            `UPDATE bookings SET status = ? WHERE id IN (${placeholders})`,
            [status, ...ids]
        );

        res.json({ message: `${result.affectedRows} booking(s) updated!`, updated: result.affectedRows });
    } catch (err) {
        console.error('Error in bulk status update:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Stats endpoint for dashboard
app.get('/api/stats', async (req, res) => {
    try {
        const [total] = await promisePool.query('SELECT COUNT(*) as count FROM bookings');
        const [pending] = await promisePool.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
        const [approved] = await promisePool.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'approved'");
        const [rejected] = await promisePool.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'rejected'");
        const [recent] = await promisePool.query('SELECT COUNT(*) as count FROM bookings WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)');

        res.json({
            total: total[0].count,
            pending: pending[0].count,
            approved: approved[0].count,
            rejected: rejected[0].count,
            recentWeek: recent[0].count,
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
