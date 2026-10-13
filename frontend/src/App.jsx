import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import TaskCard from './components/TaskCard';
import TaskTable from './components/TaskTable';
import TaskModal from './components/TaskModal';
import TaskDetailsDrawer from './components/TaskDetailsDrawer';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Pagination from './components/Pagination';
import LoadingSkeleton from './components/LoadingSkeleton';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { useDebounce } from './hooks/useDebounce';
import { taskApi } from './services/api';

export default function App() {
  // Main Data States
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter, Search, Sort States
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal & Drawer States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [activeTask, setActiveTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [detailsTask, setDetailsTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch Stats
  const loadStats = useCallback(async () => {
    try {
      const res = await taskApi.getStats();
      if (res && res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err.message);
    }
  }, []);

  // Fetch Tasks with query parameters
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskApi.getTasks({
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder,
        page,
        limit
      });

      if (res && res.success) {
        setTasks(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Error loading tasks from server.');
      showToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder, page, limit]);

  // Initial and reactive load
  useEffect(() => {
    loadTasks();
    loadStats();
  }, [loadTasks, loadStats]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Handler: Status Quick Filter click from Stats Card
  const handleSelectStatusFilter = (st) => {
    setStatusFilter(prev => (prev === st ? 'all' : st));
  };

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  // Handler: Open Create Modal
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setActiveTask(null);
    setIsTaskModalOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEditModal = (task) => {
    setModalMode('edit');
    setActiveTask(task);
    setIsTaskModalOpen(true);
  };

  // Handler: Open Details Drawer
  const handleViewDetails = (task) => {
    setDetailsTask(task);
    setIsDetailsDrawerOpen(true);
  };

  // Handler: Open Delete Dialog
  const handleOpenDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  // Handler: Submit Form (Create / Edit)
  const handleSubmitTaskForm = async (formData) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await taskApi.createTask(formData);
        showToast('Task created successfully!', 'success');
      } else {
        const res = await taskApi.updateTask(activeTask.id, formData);
        showToast('Task updated successfully!', 'success');
        if (detailsTask && detailsTask.id === activeTask.id) {
          setDetailsTask(res.data);
        }
      }
      setIsTaskModalOpen(false);
      loadTasks();
      loadStats();
    } catch (err) {
      const msg = err.errors?.length ? err.errors.map(e => e.message).join(' ') : err.message;
      showToast(msg || 'Failed to save task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Quick Status Update
  const handleQuickStatusChange = async (task, newStatus) => {
    if (task.status === newStatus) return;

    // Optimistic update
    setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, status: newStatus } : t)));
    if (detailsTask && detailsTask.id === task.id) {
      setDetailsTask(prev => ({ ...prev, status: newStatus }));
    }

    try {
      await taskApi.updateTask(task.id, { status: newStatus });
      showToast(`Task status changed to ${newStatus.replace('_', ' ')}`, 'success');
      loadStats();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
      loadTasks(); // rollback
    }
  };

  // Handler: Confirm Delete Task
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(id);
      showToast('Task deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      if (detailsTask && detailsTask.id === id) {
        setIsDetailsDrawerOpen(false);
        setDetailsTask(null);
      }
      loadTasks();
      loadStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasFilters = Boolean(search || statusFilter !== 'all' || priorityFilter !== 'all' || sortBy !== 'createdAt' || sortOrder !== 'desc');

  return (
    <div className="app-wrapper">
      {/* Dynamic Ambient Blur Blobs */}
      <div className="ambient-background">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
      </div>

      {/* Header */}
      <Header onOpenCreateModal={handleOpenCreateModal} />

      {/* Statistics Bar */}
      <StatsBar
        stats={stats}
        currentStatusFilter={statusFilter}
        onSelectStatusFilter={handleSelectStatusFilter}
      />

      {/* Filters and Search Toolbar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
      />

      {/* Main Task List Area */}
      <main className="container" style={{ flex: 1, paddingBottom: '2rem' }}>
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{error}</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadTasks}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton viewMode={viewMode} count={limit > 6 ? 6 : limit} />
        ) : tasks.length === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            onResetFilters={handleResetFilters}
            onCreateTask={handleOpenCreateModal}
          />
        ) : viewMode === 'grid' ? (
          <div className="tasks-grid">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={handleViewDetails}
                onEditTask={handleOpenEditModal}
                onDeleteTask={handleOpenDeleteModal}
                onQuickStatusChange={handleQuickStatusChange}
              />
            ))}
          </div>
        ) : (
          <TaskTable
            tasks={tasks}
            onViewDetails={handleViewDetails}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleOpenDeleteModal}
            onQuickStatusChange={handleQuickStatusChange}
          />
        )}

        {/* Pagination */}
        {!loading && tasks.length > 0 && (
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        )}
      </main>

      {/* Task Form Modal (Create & Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        mode={modalMode}
        initialData={activeTask}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSubmitTaskForm}
        isSubmitting={isSubmitting}
      />

      {/* Task Details Drawer */}
      <TaskDetailsDrawer
        task={detailsTask}
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        onEdit={(task) => {
          setIsDetailsDrawerOpen(false);
          handleOpenEditModal(task);
        }}
        onDelete={(task) => {
          handleOpenDeleteModal(task);
        }}
        onStatusChange={handleQuickStatusChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Toast Alert Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <div>
            <strong>TaskFlow</strong> &mdash; Full-Stack In-Memory REST Task Management System
          </div>
          <div>
            Backend: Node.js + Express &bull; Frontend: React + Vite
          </div>
        </div>
      </footer>
    </div>
  );
}
