# DVO88 Project Dashboard

A draggable project management dashboard with cross-platform persistence via PostgreSQL.

## 🌐 Live Site
https://dvo88.com

## 🎨 Features
- 📋 Draggable project cards with color themes
- ✅ Task management with checkboxes and drag-and-drop reordering
- 🔄 Flip cards to see "For Later" items
- 🔗 Project links (Live URL, GitHub, Render)
- ⌨️ Keyboard shortcuts (Alt+S for strikethrough)
- 💾 PostgreSQL persistence (with localStorage fallback)
- 🌙 Dark mode support

## 🚀 Quick Start

### Using Existing PostgreSQL Database
1. Clone this repository
2. Copy `.env.example` to `.env`
3. Add your existing database URL: `DATABASE_URL=postgres://...`
4. Run setup: `node setup-database.js`
5. Install dependencies: `npm install`
6. Start server: `npm start`

The setup script creates tables with `dvo88_` prefix to avoid conflicts.

## 🛠️ Deployment on Render

1. Push to GitHub
2. In Render Dashboard:
   - Create new Web Service
   - Connect this repository
   - Add environment variable: `DATABASE_URL` (your existing database)
3. Deploy!

## 📁 Structure
```
dvo88-landing/
├── index.html         # Frontend with draggable cards
├── server.js          # Express API server
├── api-client.js      # Frontend API client
├── setup-database.js  # Database setup script
├── package.json       # Node dependencies
└── render.yaml        # Render configuration
```

## 💾 Database Schema
- `dvo88_projects` - Project cards with color and position
- `dvo88_tasks` - Tasks with drag-drop ordering
- `dvo88_project_links` - GitHub, Live, and Render URLs

## 🛠️ Technologies
- Frontend: Vanilla JavaScript, Tailwind CSS, SortableJS
- Backend: Node.js, Express, PostgreSQL
- Deployment: Render with custom domain

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>