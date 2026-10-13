import React from 'react';
import { ClipboardList, Plus, RotateCcw } from 'lucide-react';

export default function EmptyState({
  hasFilters,
  onResetFilters,
  onCreateTask
}) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon">
        <ClipboardList size={32} />
      </div>

      <h3 className="empty-state-title">
        {hasFilters ? 'No Matching Tasks Found' : 'Your Task Workspace is Clean'}
      </h3>

      <p className="empty-state-desc">
        {hasFilters
          ? 'No tasks matched your current search keywords or filters. Try adjusting your query or reset filters.'
          : 'You do not have any tasks yet. Create your first task to start organizing your work and tracking deadlines!'}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {hasFilters ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}
          >
            <RotateCcw size={16} />
            <span>Reset Filters</span>
          </button>
        ) : null}

        <button
          type="button"
          className="btn btn-primary"
          onClick={onCreateTask}
        >
          <Plus size={16} />
          <span>Create New Task</span>
        </button>
      </div>
    </div>
  );
}
