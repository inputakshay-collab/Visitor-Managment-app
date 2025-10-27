import React from 'react';

export default function Reports() {
  return (
    <div className="overview-content">
      <h2>📊 Reports</h2>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
        This is a placeholder for the Reports page. You can add scheduled reports, exports, and analytics here.
      </p>

      <div style={{ marginTop: '1.5rem' }}>
        <div className="dashboard-card" style={{ padding: '1.25rem' }}>
          <div className="card-header">
            <div className="card-title">Visitor Metrics (Last 7 days)</div>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Charts will go here.</div>
        </div>
      </div>
    </div>
  );
}
