const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Create tables if they don't exist (with dvo88_ prefix to avoid conflicts)
async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dvo88_projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        color VARCHAR(50) NOT NULL,
        is_flipped BOOLEAN DEFAULT false,
        position INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS dvo88_tasks (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES dvo88_projects(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        checked BOOLEAN DEFAULT false,
        accent_color VARCHAR(50) DEFAULT 'blue',
        is_for_later BOOLEAN DEFAULT false,
        position INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS dvo88_project_links (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES dvo88_projects(id) ON DELETE CASCADE,
        live_url TEXT,
        github_url TEXT,
        render_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DVO88 Dashboard API is running' });
});

// Get all projects with tasks and links
app.get('/api/projects', async (req, res) => {
  try {
    const projectsQuery = await pool.query('SELECT * FROM dvo88_projects ORDER BY position');
    const projects = projectsQuery.rows;

    // Get tasks and links for each project
    for (let project of projects) {
      const tasksQuery = await pool.query(
        'SELECT * FROM dvo88_tasks WHERE project_id = $1 ORDER BY position',
        [project.id]
      );
      
      const linksQuery = await pool.query(
        'SELECT * FROM dvo88_project_links WHERE project_id = $1',
        [project.id]
      );

      project.tasks = tasksQuery.rows.filter(task => !task.is_for_later);
      project.forLaterTasks = tasksQuery.rows.filter(task => task.is_for_later);
      project.links = linksQuery.rows[0] || { live_url: '', github_url: '', render_url: '' };
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, color, tasks = [], forLaterTasks = [], links = {} } = req.body;
    
    // Get the highest position
    const maxPosQuery = await pool.query('SELECT COALESCE(MAX(position), 0) as max_pos FROM dvo88_projects');
    const newPosition = maxPosQuery.rows[0].max_pos + 1;

    // Insert project
    const projectQuery = await pool.query(
      'INSERT INTO dvo88_projects (title, color, position) VALUES ($1, $2, $3) RETURNING *',
      [title, color, newPosition]
    );
    const project = projectQuery.rows[0];

    // Insert tasks
    for (let i = 0; i < tasks.length; i++) {
      await pool.query(
        'INSERT INTO dvo88_tasks (project_id, text, checked, accent_color, is_for_later, position) VALUES ($1, $2, $3, $4, $5, $6)',
        [project.id, tasks[i].text, tasks[i].checked || false, tasks[i].accentColor || 'blue', false, i]
      );
    }

    // Insert for later tasks
    for (let i = 0; i < forLaterTasks.length; i++) {
      await pool.query(
        'INSERT INTO dvo88_tasks (project_id, text, checked, accent_color, is_for_later, position) VALUES ($1, $2, $3, $4, $5, $6)',
        [project.id, forLaterTasks[i].text, forLaterTasks[i].checked || false, forLaterTasks[i].accentColor || 'gray', true, i]
      );
    }

    // Insert links
    await pool.query(
      'INSERT INTO dvo88_project_links (project_id, live_url, github_url, render_url) VALUES ($1, $2, $3, $4)',
      [project.id, links.live || '', links.github || '', links.render || '']
    );

    res.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, color, is_flipped } = req.body;

    const result = await pool.query(
      'UPDATE dvo88_projects SET title = $1, color = $2, is_flipped = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, color, is_flipped, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM dvo88_projects WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Update project positions (for drag and drop)
app.put('/api/projects/reorder', async (req, res) => {
  try {
    const { projectIds } = req.body;
    
    for (let i = 0; i < projectIds.length; i++) {
      await pool.query(
        'UPDATE dvo88_projects SET position = $1 WHERE id = $2',
        [i, projectIds[i]]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering projects:', error);
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
});

// Task routes
app.post('/api/tasks', async (req, res) => {
  try {
    const { project_id, text, is_for_later = false } = req.body;
    
    // Get the highest position for this project
    const maxPosQuery = await pool.query(
      'SELECT COALESCE(MAX(position), 0) as max_pos FROM dvo88_tasks WHERE project_id = $1 AND is_for_later = $2',
      [project_id, is_for_later]
    );
    const newPosition = maxPosQuery.rows[0].max_pos + 1;

    const result = await pool.query(
      'INSERT INTO dvo88_tasks (project_id, text, is_for_later, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [project_id, text, is_for_later, newPosition]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, checked, accent_color } = req.body;

    const result = await pool.query(
      'UPDATE dvo88_tasks SET text = $1, checked = $2, accent_color = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [text, checked, accent_color, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM dvo88_tasks WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Update task positions (for drag and drop)
app.put('/api/tasks/reorder', async (req, res) => {
  try {
    const { taskIds, projectId, isForLater } = req.body;
    
    for (let i = 0; i < taskIds.length; i++) {
      await pool.query(
        'UPDATE dvo88_tasks SET position = $1 WHERE id = $2 AND project_id = $3 AND is_for_later = $4',
        [i, taskIds[i], projectId, isForLater]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
});

// Update project links
app.put('/api/projects/:id/links', async (req, res) => {
  try {
    const { id } = req.params;
    const { live_url, github_url, render_url } = req.body;

    // Check if links exist
    const existing = await pool.query('SELECT * FROM dvo88_project_links WHERE project_id = $1', [id]);
    
    if (existing.rows.length > 0) {
      // Update existing
      const result = await pool.query(
        'UPDATE dvo88_project_links SET live_url = $1, github_url = $2, render_url = $3, updated_at = CURRENT_TIMESTAMP WHERE project_id = $4 RETURNING *',
        [live_url, github_url, render_url, id]
      );
      res.json(result.rows[0]);
    } else {
      // Insert new
      const result = await pool.query(
        'INSERT INTO dvo88_project_links (project_id, live_url, github_url, render_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, live_url, github_url, render_url]
      );
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating links:', error);
    res.status(500).json({ error: 'Failed to update links' });
  }
});

// Initialize database and start server
createTables().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});