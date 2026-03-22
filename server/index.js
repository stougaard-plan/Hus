const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

app.use(cors());
app.use(express.json());

// Health check — must respond before static/SPA middleware
app.get('/health', (req, res) => res.json({ ok: true }));

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// --- AUTH ---
const PIN = process.env.APP_PIN || '2023';

app.post('/api/auth', (req, res) => {
  const { pin } = req.body;
  if (pin === PIN) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Forkert PIN' });
  }
});

// --- TASKS ---
app.get('/api/tasks', async (req, res) => {
  try {
    const { category, season } = req.query;
    let query = 'SELECT * FROM tasks';
    const conditions = [];
    const params = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    if (season) {
      params.push(`%${season}%`);
      conditions.push(`season ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY category, title';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/tasks error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Opgave ikke fundet' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /api/tasks/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- TASK INSTANCES ---
app.get('/api/instances', async (req, res) => {
  try {
    const { status, from, to } = req.query;
    let query = `
      SELECT ti.*, t.title, t.category, t.frequency, t.estimated_minutes, t.child_friendly, t.steps
      FROM task_instances ti
      JOIN tasks t ON ti.task_id = t.id
    `;
    const conditions = [];
    const params = [];

    if (status) {
      params.push(status);
      conditions.push(`ti.status = $${params.length}`);
    }
    if (from) {
      params.push(from);
      conditions.push(`ti.planned_date >= $${params.length}`);
    }
    if (to) {
      params.push(to);
      conditions.push(`ti.planned_date <= $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY ti.planned_date ASC NULLS LAST, ti.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/instances error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/instances', async (req, res) => {
  try {
    const { task_id, planned_date, assigned_to } = req.body;
    const result = await pool.query(
      `INSERT INTO task_instances (task_id, planned_date, assigned_to)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [task_id, planned_date || null, assigned_to || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/instances error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.patch('/api/instances/:id', async (req, res) => {
  try {
    const { status, planned_date, assigned_to, done_date } = req.body;
    const fields = [];
    const params = [];

    if (status !== undefined) {
      params.push(status);
      fields.push(`status = $${params.length}`);
      if (status === 'done' && !done_date) {
        params.push(new Date().toISOString().split('T')[0]);
        fields.push(`done_date = $${params.length}`);
      }
    }
    if (done_date !== undefined) {
      params.push(done_date);
      fields.push(`done_date = $${params.length}`);
    }
    if (planned_date !== undefined) {
      params.push(planned_date);
      fields.push(`planned_date = $${params.length}`);
    }
    if (assigned_to !== undefined) {
      params.push(assigned_to);
      fields.push(`assigned_to = $${params.length}`);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Ingen felter at opdatere' });
    }

    params.push(req.params.id);
    const result = await pool.query(
      `UPDATE task_instances SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Instans ikke fundet' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH /api/instances/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/instances/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM task_instances WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Instans ikke fundet' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/instances/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- STATS ---
app.get('/api/stats', async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM task_instances');
    const done = await pool.query("SELECT COUNT(*) FROM task_instances WHERE status = 'done'");
    const planned = await pool.query("SELECT COUNT(*) FROM task_instances WHERE status = 'planned'");
    const byCategory = await pool.query(`
      SELECT t.category, COUNT(*) as count
      FROM task_instances ti JOIN tasks t ON ti.task_id = t.id
      WHERE ti.status = 'done'
      GROUP BY t.category ORDER BY count DESC
    `);

    res.json({
      total: parseInt(total.rows[0].count),
      done: parseInt(done.rows[0].count),
      planned: parseInt(planned.rows[0].count),
      byCategory: byCategory.rows,
    });
  } catch (err) {
    console.error('GET /api/stats error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// SPA fallback in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start server immediately so healthcheck passes, then init DB
app.listen(port, '0.0.0.0', () => {
  console.log(`HusApp API running on port ${port}`);
  // Init database after server is listening
  (async () => {
    try {
      const fs = require('fs');
      const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
      const seed = fs.readFileSync(path.join(__dirname, '../db/seed.sql'), 'utf8');
      console.log('Running schema...');
      await pool.query(schema);
      const existing = await pool.query('SELECT COUNT(*) FROM tasks');
      if (parseInt(existing.rows[0].count) === 0) {
        console.log('Running seed...');
        await pool.query(seed);
        console.log('Seed data inserted.');
      }
      console.log('Database ready.');
    } catch (err) {
      console.error('DB init warning:', err.message);
    }
  })();
});
