#!/usr/bin/env node
// Run this script to set up the dvo88 tables in your existing database
// Usage: DATABASE_URL=your_connection_string node setup-database.js

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupTables() {
  console.log('🚀 Setting up DVO88 project dashboard tables...\n');
  
  try {
    // Create projects table
    console.log('Creating dvo88_projects table...');
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
    console.log('✅ dvo88_projects table created\n');

    // Create tasks table
    console.log('Creating dvo88_tasks table...');
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
    console.log('✅ dvo88_tasks table created\n');

    // Create project links table
    console.log('Creating dvo88_project_links table...');
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
    console.log('✅ dvo88_project_links table created\n');

    console.log('🎉 All tables created successfully!');
    console.log('\n📝 Tables created with dvo88_ prefix to avoid conflicts with existing tables.');
    console.log('Your project dashboard is ready to use!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    process.exit(1);
  }
}

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.error('Usage: DATABASE_URL=postgres://user:pass@host/db node setup-database.js');
  process.exit(1);
}

setupTables();