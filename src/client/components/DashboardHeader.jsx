import React from 'react';
import './DashboardHeader.css';

export default function DashboardHeader({ stats, currentUser }) {
  return (
    <div className="dashboard-header">
      <div className="header-welcome">
        <h1>
          <span className="welcome-emoji">👋</span>
          Welcome, {currentUser?.name || 'User'}
        </h1>
        <p className="welcome-subtitle">Here's what's happening in your visitor management system</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card primary-gradient">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalVisitors}</h3>
            <p>Total Visitors</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">↑ 12%</span>
            <span className="trend-period">vs last week</span>
          </div>
        </div>

        <div className="stat-card warning-gradient">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingRequests}</h3>
            <p>Pending Requests</p>
          </div>
          <div className="stat-trend">
            <span className="trend-neutral">→ 0%</span>
            <span className="trend-period">vs yesterday</span>
          </div>
        </div>

        <div className="stat-card success-gradient">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.checkedInToday}</h3>
            <p>Checked In Today</p>
          </div>
          <div className="stat-badge">Live</div>
        </div>

        <div className="stat-card info-gradient">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.approvedToday}</h3>
            <p>Approved Today</p>
          </div>
          <div className="stat-trend">
            <span className="trend-up">↑ 8%</span>
            <span className="trend-period">vs yesterday</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="action-button primary">
          <span className="action-icon">➕</span>
          New Visit Request
        </button>
        <button className="action-button secondary">
          <span className="action-icon">🔍</span>
          Find Visitor
        </button>
        <button className="action-button success">
          <span className="action-icon">📊</span>
          View Reports
        </button>
      </div>
    </div>
  );
}