import { TaskService } from '../services/task.service.js';

/**
 * Task Controller
 * Handles HTTP requests, delegates to TaskService, and formats responses.
 */

export const TaskController = {
  /**
   * GET /api/tasks
   * Query params: search, status, priority, sortBy, sortOrder, page, limit
   */
  getAllTasks(req, res, next) {
    try {
      const { search, status, priority, sortBy, sortOrder, page, limit } = req.query;
      const result = TaskService.getAll({
        search,
        status,
        priority,
        sortBy,
        sortOrder,
        page,
        limit
      });

      res.status(200).json({
        success: true,
        data: result.tasks,
        pagination: result.pagination,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/tasks/stats
   * Retrieve aggregate statistics for the dashboard
   */
  getTaskStats(req, res, next) {
    try {
      const stats = TaskService.getStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/tasks/:id
   */
  getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = TaskService.getById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with ID "${id}" was not found.`
        });
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/tasks
   */
  createTask(req, res, next) {
    try {
      const { title, description, status, priority, dueDate } = req.body;
      const created = TaskService.create({
        title,
        description,
        status,
        priority,
        dueDate
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: created
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/tasks/:id
   */
  updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const updated = TaskService.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Task with ID "${id}" was not found.`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/tasks/:id
   */
  deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = TaskService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Task with ID "${id}" was not found.`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: { id }
      });
    } catch (error) {
      next(error);
    }
  }
};
