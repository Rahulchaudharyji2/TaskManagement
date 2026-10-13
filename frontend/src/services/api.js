/**
 * Centralized API Service Layer
 * Connects to the Express REST backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Generic fetch wrapper with JSON parsing and standardized error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.errors = data?.errors || [];
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      // Network or connection error
      error.message = error.message || 'Unable to connect to the backend server. Please verify backend is running.';
    }
    throw error;
  }
}

export const taskApi = {
  /**
   * Fetch tasks with optional search, filter, sort, and pagination parameters
   */
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return request(endpoint, { method: 'GET' });
  },

  /**
   * Fetch aggregate task statistics
   */
  async getStats() {
    return request('/tasks/stats', { method: 'GET' });
  },

  /**
   * Fetch a single task by ID
   */
  async getTaskById(id) {
    return request(`/tasks/${id}`, { method: 'GET' });
  },

  /**
   * Create a new task
   */
  async createTask(taskData) {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  /**
   * Update an existing task
   */
  async updateTask(id, taskData) {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  },

  /**
   * Delete a task
   */
  async deleteTask(id) {
    return request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }
};
