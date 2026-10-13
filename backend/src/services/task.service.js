/**
 * In-Memory Task Management Service
 * Manages tasks in runtime memory without persistent database.
 */

// Seed data to give a realistic demo experience immediately upon launch
let tasks = [
  {
    id: "task-1001",
    title: "Design Modern System Architecture",
    description: "Structure modular REST API layers (routes, controllers, services, middleware) and stateful client components.",
    status: "completed",
    priority: "high",
    dueDate: "2026-10-14",
    createdAt: "2026-10-10T08:30:00.000Z",
    updatedAt: "2026-10-11T12:00:00.000Z"
  },
  {
    id: "task-1002",
    title: "Implement Centralized Error Handling & Validation",
    description: "Ensure schema validation for title, description, priority, and date fields with informative error responses.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-16",
    createdAt: "2026-10-11T09:15:00.000Z",
    updatedAt: "2026-10-12T14:20:00.000Z"
  },
  {
    id: "task-1003",
    title: "Build Responsive React Dashboard with Dark Mode",
    description: "Create glassmorphic UI cards, status badges, debounced search bar, and interactive drawer/modal views.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-10-18",
    createdAt: "2026-10-11T11:00:00.000Z",
    updatedAt: "2026-10-12T16:00:00.000Z"
  },
  {
    id: "task-1004",
    title: "Set up OpenAPI / Swagger Interactive Docs",
    description: "Document all REST endpoints with query params, request bodies, and expected status codes.",
    status: "pending",
    priority: "medium",
    dueDate: "2026-10-20",
    createdAt: "2026-10-12T07:45:00.000Z",
    updatedAt: "2026-10-12T07:45:00.000Z"
  },
  {
    id: "task-1005",
    title: "Export Postman Collection & Test Suites",
    description: "Generate complete Postman v2.1 collection file covering edge cases like 400 validation and 404 not found.",
    status: "pending",
    priority: "low",
    dueDate: "2026-10-25",
    createdAt: "2026-10-12T10:00:00.000Z",
    updatedAt: "2026-10-12T10:00:00.000Z"
  }
];

// Priority weight for sorting
const PRIORITY_WEIGHT = {
  high: 3,
  medium: 2,
  low: 1
};

export const TaskService = {
  /**
   * Retrieve all tasks with optional search, filtering, sorting, and pagination
   */
  getAll({ search, status, priority, sortBy = 'createdAt', sortOrder = 'desc', page, limit }) {
    let result = [...tasks];

    // Filter by search term (case-insensitive in title or description)
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      result = result.filter(
        t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (status && status !== 'all') {
      result = result.filter(t => t.status === status);
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      result = result.filter(t => t.priority === priority);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'priority') {
        comparison = (PRIORITY_WEIGHT[a.priority] || 0) - (PRIORITY_WEIGHT[b.priority] || 0);
      } else if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        comparison = dateA - dateB;
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else {
        // default: createdAt
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        comparison = dateA - dateB;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    const total = result.length;

    // Optional pagination
    if (page !== undefined && limit !== undefined) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedData = result.slice(startIndex, startIndex + limitNum);

      return {
        tasks: paginatedData,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      };
    }

    return {
      tasks: result,
      pagination: {
        total,
        page: 1,
        limit: total,
        totalPages: 1
      }
    };
  },

  /**
   * Get a single task by ID
   */
  getById(id) {
    return tasks.find(t => t.id === id) || null;
  },

  /**
   * Create a new task
   */
  create(taskData) {
    const id = `task-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newTask = {
      id,
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: now,
      updatedAt: now
    };

    tasks.unshift(newTask);
    return newTask;
  },

  /**
   * Update an existing task
   */
  update(id, updates) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return null;

    const existing = tasks[taskIndex];
    const updatedTask = {
      ...existing,
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: updates.description.trim() }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.priority !== undefined && { priority: updates.priority }),
      ...(updates.dueDate !== undefined && { dueDate: updates.dueDate || null }),
      updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    return updatedTask;
  },

  /**
   * Delete a task by ID
   */
  delete(id) {
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== id);
    return tasks.length < initialLength;
  },

  /**
   * Get dashboard metrics and counts
   */
  getStats() {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      highPriority: tasks.filter(t => t.priority === 'high').length
    };
  },

  /**
   * Reset in-memory data (useful for testing or initial demo state)
   */
  reset() {
    tasks = [];
  }
};
