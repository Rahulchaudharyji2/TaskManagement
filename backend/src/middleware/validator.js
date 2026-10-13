/**
 * Request validation middleware for Tasks
 */

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

export const validateCreateTask = (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required and cannot be empty.' });
  } else if (title.trim().length > 120) {
    errors.push({ field: 'title', message: 'Title cannot exceed 120 characters.' });
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push({ field: 'description', message: 'Description is required and cannot be empty.' });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    errors.push({
      field: 'status',
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}.`
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.push({
      field: 'priority',
      message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`
    });
  }

  if (dueDate) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'dueDate', message: 'Due date must be a valid date format (e.g., YYYY-MM-DD).' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateUpdateTask = (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.push({ field: 'title', message: 'Title cannot be empty.' });
    } else if (title.trim().length > 120) {
      errors.push({ field: 'title', message: 'Title cannot exceed 120 characters.' });
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim() === '') {
      errors.push({ field: 'description', message: 'Description cannot be empty.' });
    }
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push({
      field: 'status',
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}.`
    });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push({
      field: 'priority',
      message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`
    });
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'dueDate', message: 'Due date must be a valid date format.' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};
