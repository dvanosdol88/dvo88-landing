// API Client for project dashboard
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

class ProjectAPI {
  // Fetch all projects
  async getAllProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return null;
    }
  }

  // Create a new project
  async createProject(projectData) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (!response.ok) throw new Error('Failed to create project');
      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  // Update a project
  async updateProject(projectId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update project');
      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  // Delete a project
  async deleteProject(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete project');
      return await response.json();
    } catch (error) {
      console.error('Error deleting project:', error);
      return null;
    }
  }

  // Reorder projects
  async reorderProjects(projectIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds })
      });
      if (!response.ok) throw new Error('Failed to reorder projects');
      return await response.json();
    } catch (error) {
      console.error('Error reordering projects:', error);
      return null;
    }
  }

  // Create a task
  async createTask(projectId, text, isForLater = false) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, text, is_for_later: isForLater })
      });
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  // Update a task
  async updateTask(taskId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }

  // Delete a task
  async deleteTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete task');
      return await response.json();
    } catch (error) {
      console.error('Error deleting task:', error);
      return null;
    }
  }

  // Reorder tasks
  async reorderTasks(taskIds, projectId, isForLater) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIds, projectId, isForLater })
      });
      if (!response.ok) throw new Error('Failed to reorder tasks');
      return await response.json();
    } catch (error) {
      console.error('Error reordering tasks:', error);
      return null;
    }
  }

  // Update project links
  async updateProjectLinks(projectId, links) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/links`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          live_url: links.live || '',
          github_url: links.github || '',
          render_url: links.render || ''
        })
      });
      if (!response.ok) throw new Error('Failed to update links');
      return await response.json();
    } catch (error) {
      console.error('Error updating links:', error);
      return null;
    }
  }
}

// Create global instance
window.projectAPI = new ProjectAPI();