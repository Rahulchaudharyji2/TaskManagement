import React from 'react';

export default function LoadingSkeleton({ viewMode = 'grid', count = 6 }) {
  if (viewMode === 'table') {
    return (
      <div className="table-container">
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
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td>
                  <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: '6px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '45%' }} />
                </td>
                <td><div className="skeleton" style={{ height: '26px', width: '80px', borderRadius: '14px' }} /></td>
                <td><div className="skeleton" style={{ height: '22px', width: '60px', borderRadius: '12px' }} /></td>
                <td><div className="skeleton" style={{ height: '16px', width: '70px' }} /></td>
                <td><div className="skeleton" style={{ height: '16px', width: '70px' }} /></td>
                <td><div className="skeleton" style={{ height: '28px', width: '80px', marginLeft: 'auto' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="task-card" style={{ minHeight: '230px' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div className="skeleton" style={{ height: '22px', width: '90px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ height: '22px', width: '80px', borderRadius: '12px' }} />
          </div>
          <div className="skeleton" style={{ height: '20px', width: '85%', marginBottom: '0.75rem' }} />
          <div className="skeleton" style={{ height: '14px', width: '95%', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '14px', width: '65%', marginBottom: '1.5rem' }} />
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
            <div className="skeleton" style={{ height: '28px', width: '100px' }} />
            <div className="skeleton" style={{ height: '28px', width: '80px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
