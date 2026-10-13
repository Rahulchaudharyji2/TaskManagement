import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { validateCreateTask, validateUpdateTask } from '../middleware/validator.js';

const router = Router();

// Routes
router.get('/', TaskController.getAllTasks);
router.get('/stats', TaskController.getTaskStats);
router.get('/:id', TaskController.getTaskById);
router.post('/', validateCreateTask, TaskController.createTask);
router.put('/:id', validateUpdateTask, TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;
