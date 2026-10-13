import React from 'react';
import { Layers, Clock, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StatsBar({ stats, currentStatusFilter, onSelectStatusFilter }) {
  const cards = [
    {
      id: 'all',
      label: 'Total Tasks',
      value: stats?.total ?? 0,
      icon: <Layers size={22} />,
      iconClass: 'stat-icon-total',
      filterVal: 'all'
    },
    {
      id: 'pending',
      label: 'Pending',
      value: stats?.pending ?? 0,
      icon: <Clock size={22} />,
      iconClass: 'stat-icon-pending',
      filterVal: 'pending'
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      value: stats?.inProgress ?? 0,
      icon: <Activity size={22} />,
      iconClass: 'stat-icon-inprogress',
      filterVal: 'in_progress'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: stats?.completed ?? 0,
      icon: <CheckCircle2 size={22} />,
      iconClass: 'stat-icon-completed',
      filterVal: 'completed'
    },
    {
      id: 'high',
      label: 'High Priority',
      value: stats?.highPriority ?? 0,
      icon: <AlertCircle size={22} />,
      iconClass: 'stat-icon-high',
      filterVal: null
    }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {cards.map(card => {
            const isActive = card.filterVal && currentStatusFilter === card.filterVal;
            return (
              <div
                key={card.id}
                className={`stat-card ${isActive ? 'active-filter' : ''}`}
                onClick={() => card.filterVal && onSelectStatusFilter(card.filterVal)}
                title={card.filterVal ? `Filter by ${card.label}` : card.label}
              >
                <div className={`stat-icon-wrapper ${card.iconClass}`}>
                  {card.icon}
                </div>
                <div className="stat-info">
                  <span className="stat-label">{card.label}</span>
                  <span className="stat-value">{card.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
