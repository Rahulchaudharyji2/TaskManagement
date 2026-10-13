import React from 'react';
import { Eye, Edit3, Trash2 } from 'lucide-react';

export default function TaskTable({
  tasks,
  onViewDetails,
  onEditTask,
  onDeleteTask,
  onQuickStatusChange
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="table-container animate-fade-in">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task Details</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Created</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} id={`task-row-${task.id}`}>
              <td className="table-title-cell">
                <div
                  className="table-title-text"
                  onClick={() => onViewDetails(task)}
                >
                  {task.title}
                </div>
                <div className="table-desc-text">
                  {task.description}
                </div>
              </td>

              <td>
                <select
                  className="status-quick-select"
                  value={task.status}
                  onChange={(e) => onQuickStatusChange(task, e.target.value)}
                  title="Change status"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>

              <td>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority}
                </span>
              </td>

              <td>{formatDate(task.dueDate)}</td>

              <td>{formatDate(task.createdAt)}</td>

              <td>
                <div className="card-actions-group" style={{ justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => onViewDetails(task)}
                    title="View task details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => onEditTask(task)}
                    title="Edit task"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => onDeleteTask(task)}
                    title="Delete task"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
