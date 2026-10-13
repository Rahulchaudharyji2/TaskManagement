import React from 'react';
import { CheckSquare, Moon, Sun, Plus, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ onOpenCreateModal }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="container header-container">
        <div className="brand-wrapper">
          <div className="brand-icon-box">
            <CheckSquare size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            <p className="brand-tagline">RESTful Task Management System</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Swagger API docs link */}
          <a
            href="http://localhost:5001/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            title="Open Swagger REST API Documentation"
          >
            <FileText size={16} />
            <span>API Docs</span>
          </a>

          {/* Theme Switcher */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Create Task Button */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Create Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
