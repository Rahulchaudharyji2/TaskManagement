import React from 'react';
import { X, Calendar, Clock, Edit3, Trash2, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

export default function TaskDetailsDrawer({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}) {
  if (!isOpen || !task) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Not available';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return dateStr;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0) && task.status !== 'completed';

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer-content"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Task Details"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className={`badge badge-${task.priority}`}>
              {task.priority} Priority
            </span>
            <span className={`badge badge-${task.status}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Title */}
          <div>
            <span className="detail-section-title">Task Title</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: 1.35 }}>
              {task.title}
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontFamily: 'monospace' }}>
              ID: {task.id}
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="detail-section-title">Description</span>
            <div className="detail-description-box">
              {task.description}
            </div>
          </div>

          {/* Key Timestamps Grid */}
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-item-label">Due Date</span>
              <div className={`detail-item-value ${isOverdue ? 'overdue' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} />
                <span>{formatDate(task.dueDate)}</span>
                {isOverdue && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>(Overdue)</span>}
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Current Status</span>
              <div className="detail-item-value" style={{ textTransform: 'capitalize' }}>
                {task.status.replace('_', ' ')}
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Created At</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                <Clock size={14} />
                <span>{formatTimestamp(task.createdAt)}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Last Updated</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                <Clock size={14} />
                <span>{formatTimestamp(task.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="drawer-footer">
          {task.status !== 'completed' ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onStatusChange(task, 'completed');
              }}
              style={{ color: '#059669' }}
            >
              <CheckCircle2 size={16} />
              <span>Mark Complete</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onStatusChange(task, 'in_progress');
              }}
            >
              <RotateCcw size={16} />
              <span>Reopen Task</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onEdit(task);
            }}
          >
            <Edit3 size={16} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onDelete(task);
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
