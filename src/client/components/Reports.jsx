import React, { useState } from 'react';
import './Reports.css';

export default function Reports() {
  const [activeTimeframe, setActiveTimeframe] = useState('week');

  return (
    <div className="reports-container">
      <h2>📊 Analytics Dashboard</h2>
      
      <div className="reports-grid">
        <div className="report-card">
          <div className="stat-label">Total Visitors</div>
          <div className="stat-value">1,284</div>
          <div className="trend trend-up">
            <span>↑ 12.5%</span>
            <span>vs last month</span>
          </div>
        </div>

        <div className="report-card">
          <div className="stat-label">Active Check-ins</div>
          <div className="stat-value">47</div>
          <div className="trend trend-up">
            <span>↑ 8.3%</span>
            <span>vs yesterday</span>
          </div>
        </div>

        <div className="report-card">
          <div className="stat-label">Room Bookings</div>
          <div className="stat-value">892</div>
          <div className="trend trend-down">
            <span>↓ 3.2%</span>
            <span>vs last week</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Visitor Traffic Trends</div>
          <div className="time-filter">
            <button 
              className={activeTimeframe === 'week' ? 'active' : ''} 
              onClick={() => setActiveTimeframe('week')}
            >
              Week
            </button>
            <button 
              className={activeTimeframe === 'month' ? 'active' : ''} 
              onClick={() => setActiveTimeframe('month')}
            >
              Month
            </button>
            <button 
              className={activeTimeframe === 'year' ? 'active' : ''} 
              onClick={() => setActiveTimeframe('year')}
            >
              Year
            </button>
          </div>
        </div>

        {/* Placeholder for chart - in a real app, you'd use a charting library like Chart.js or Recharts */}
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          Chart visualization will go here
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Recent Visitor Activity</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Purpose</th>
              <th>Check-in Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Smith</td>
              <td>Meeting</td>
              <td>10:30 AM</td>
              <td>Checked In</td>
            </tr>
            <tr>
              <td>Sarah Johnson</td>
              <td>Interview</td>
              <td>11:15 AM</td>
              <td>Checked Out</td>
            </tr>
            <tr>
              <td>Michael Brown</td>
              <td>Delivery</td>
              <td>12:00 PM</td>
              <td>Checked In</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
