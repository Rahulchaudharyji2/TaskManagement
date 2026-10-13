import React from 'react';
import { Search, X, ArrowUpDown, LayoutGrid, List, RotateCcw } from 'lucide-react';

export default function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  viewMode,
  onViewModeChange,
  onResetFilters
}) {
  const hasActiveFilters = search || status !== 'all' || priority !== 'all' || sortBy !== 'createdAt' || sortOrder !== 'desc';

  return (
    <section className="toolbar-section">
      <div className="container">
        <div className="toolbar-card">
          {/* Search box with debounced input */}
          <div className="search-box-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title or description..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter and Sort Controls */}
          <div className="filters-wrapper">
            {/* Status Dropdown */}
            <select
              className="select-filter"
              value={status}
              onChange={e => onStatusChange(e.target.value)}
              title="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Dropdown */}
            <select
              className="select-filter"
              value={priority}
              onChange={e => onPriorityChange(e.target.value)}
              title="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Sort Field */}
            <select
              className="select-filter"
              value={sortBy}
              onChange={e => onSortByChange(e.target.value)}
              title="Sort by field"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>

            {/* Sort Order Direction Button */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onSortOrderToggle}
              title={`Sorting: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              style={{ padding: '0.6rem 0.85rem' }}
            >
              <ArrowUpDown size={15} />
              <span>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
            </button>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onResetFilters}
                title="Reset all filters"
                style={{ padding: '0.6rem 0.85rem', color: 'var(--primary)' }}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
            )}

            {/* View Mode Toggle: Grid or Table */}
            <div className="view-toggle-group">
              <button
                type="button"
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => onViewModeChange('grid')}
                title="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => onViewModeChange('table')}
                title="Table view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
