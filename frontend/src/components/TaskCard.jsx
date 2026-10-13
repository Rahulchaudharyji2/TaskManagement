import React from 'react';
import { Eye, Edit3, Trash2, Calendar, Clock, AlertTriangle } from 'lucide-react';

export default function TaskCard({
  task,
  onViewDetails,
  onEditTask,
  onDeleteTask,
  onQuickStatusChange
}) {
  const isOverdue = task.dueDate && new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0) && task.status !== 'completed';

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatCreatedDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <article className="task-card animate-fade-in" id={`task-card-${task.id}`}>
      {/* Visual Accent Strip based on Priority */}
      <div className={`task-card-accent-strip accent-${task.priority}`} />

      {/* Header with Badges */}
      <div className="task-card-header">
        <div className="task-card-badges">
          <span className={`badge badge-${task.priority}`}>
            {task.priority} Priority
          </span>
          <span className={`badge badge-${task.status}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        className="task-title"
        onClick={() => onViewDetails(task)}
        title="Click to view task details"
      >
        {task.title}
      </h3>

      {/* Description Preview */}
      <p className="task-description">
        {task.description}
      </p>

      {/* Metadata */}
      <div className="task-meta-list">
        <div className={`task-meta-item ${isOverdue ? 'overdue' : ''}`}>
          {isOverdue ? <AlertTriangle size={14} /> : <Calendar size={14} />}
          <span>Due: {formatDisplayDate(task.dueDate)}</span>
          {isOverdue && <span style={{ fontSize: '0.7rem' }}>(Overdue)</span>}
        </div>
        <div className="task-meta-item">
          <Clock size={14} />
          <span>Created: {formatCreatedDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Card Footer: Quick Status Switcher & Action Buttons */}
      <div className="task-card-footer">
        <select
          className="status-quick-select"
          value={task.status}
          onChange={(e) => onQuickStatusChange(task, e.target.value)}
          title="Quick change status"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="card-actions-group">
          <button
            type="button"
            className="btn-icon"
            onClick={() => onViewDetails(task)}
            title="View details"
          >
            <Eye size={17} />
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEditTask(task)}
            title="Edit task"
          >
            <Edit3 size={17} />
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={() => onDeleteTask(task)}
            title="Delete task"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
