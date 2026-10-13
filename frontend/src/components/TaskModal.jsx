import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function TaskModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  onClose,
  onSubmit,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const validate = (dataToValidate) => {
    const newErrors = {};

    if (!dataToValidate.title || !dataToValidate.title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (dataToValidate.title.trim().length > 120) {
      newErrors.title = 'Title cannot exceed 120 characters.';
    }

    if (!dataToValidate.description || !dataToValidate.description.trim()) {
      newErrors.description = 'Task description is required.';
    }

    return newErrors;
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const fieldErrors = validate(updated);
      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors[field]
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const fieldErrors = validate(formData);
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setTouched({ title: true, description: true, dueDate: true });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      ...formData,
      dueDate: formData.dueDate ? formData.dueDate : null
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 id="task-modal-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {mode === 'edit' ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {mode === 'edit' ? 'Update task properties and schedule' : 'Add a new task to your workspace workflow'}
            </p>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
            {/* Title */}
            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                <span>Title <span className="required">*</span></span>
                <span className="form-hint">{formData.title.length}/120</span>
              </label>
              <input
                id="task-title-input"
                type="text"
                className={`form-input ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. Implement user authentication flow"
                value={formData.title}
                maxLength={120}
                onChange={e => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                autoFocus
              />
              {errors.title && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="task-desc-input" className="form-label">
                <span>Description <span className="required">*</span></span>
              </label>
              <textarea
                id="task-desc-input"
                className={`form-textarea ${errors.description ? 'is-invalid' : ''}`}
                rows={4}
                placeholder="Detailed objectives, acceptance criteria, or relevant links..."
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
              />
              {errors.description && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>

            {/* Status and Priority side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="task-status-select" className="form-label">
                  Status
                </label>
                <select
                  id="task-status-select"
                  className="form-select"
                  value={formData.status}
                  onChange={e => handleChange('status', e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-priority-select" className="form-label">
                  Priority
                </label>
                <select
                  id="task-priority-select"
                  className="form-select"
                  value={formData.priority}
                  onChange={e => handleChange('priority', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label htmlFor="task-duedate-input" className="form-label">
                Due Date
              </label>
              <input
                id="task-duedate-input"
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={e => handleChange('dueDate', e.target.value)}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--bg-primary)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{mode === 'edit' ? 'Update Task' : 'Create Task'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
