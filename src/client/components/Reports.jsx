import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './Reports.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Reports() {
  const [activeTimeframe, setActiveTimeframe] = useState('week');

  // Dummy data for visitor traffic
  const visitorTrafficData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Visitors',
        data: [65, 59, 80, 81, 56, 40, 70],
        fill: true,
        borderColor: '#ff7b00',
        backgroundColor: 'rgba(255, 123, 0, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Check-ins',
        data: [45, 50, 60, 70, 45, 30, 50],
        fill: true,
        borderColor: '#ffb56b',
        backgroundColor: 'rgba(255, 181, 107, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Dummy data for visitor purpose distribution
  const visitorPurposeData = {
    labels: ['Meeting', 'Interview', 'Delivery', 'Event', 'Other'],
    datasets: [
      {
        data: [40, 25, 15, 12, 8],
        backgroundColor: [
          'rgba(255, 123, 0, 0.8)',
          'rgba(255, 154, 68, 0.8)',
          'rgba(255, 181, 107, 0.8)',
          'rgba(255, 210, 128, 0.8)',
          'rgba(255, 228, 164, 0.8)',
        ],
        borderColor: [
          'rgba(255, 123, 0, 1)',
          'rgba(255, 154, 68, 1)',
          'rgba(255, 181, 107, 1)',
          'rgba(255, 210, 128, 1)',
          'rgba(255, 228, 164, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dummy data for room bookings
  const roomBookingData = {
    labels: ['Meeting Room 1', 'Meeting Room 2', 'Conference Hall', 'Board Room', 'Training Room'],
    datasets: [
      {
        label: 'Hours Booked',
        data: [25, 18, 30, 22, 15],
        backgroundColor: 'rgba(255, 123, 0, 0.8)',
        borderColor: 'rgba(255, 123, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

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

        <div style={{ height: '400px', marginTop: '1rem' }}>
          <Line data={visitorTrafficData} options={chartOptions} />
        </div>
      </div>

      <div className="reports-grid" style={{ marginTop: '2rem' }}>
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Visitor Purpose Distribution</div>
          </div>
          <div style={{ height: '300px', padding: '1rem' }}>
            <Doughnut data={visitorPurposeData} options={doughnutOptions} />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Room Usage (Hours)</div>
          </div>
          <div style={{ height: '300px', padding: '1rem' }}>
            <Bar data={roomBookingData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ marginTop: '2rem' }}>
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
              <td><span className="status-badge status-checked-in">Checked In</span></td>
            </tr>
            <tr>
              <td>Sarah Johnson</td>
              <td>Interview</td>
              <td>11:15 AM</td>
              <td><span className="status-badge status-checked-out">Checked Out</span></td>
            </tr>
            <tr>
              <td>Michael Brown</td>
              <td>Delivery</td>
              <td>12:00 PM</td>
              <td><span className="status-badge status-checked-in">Checked In</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
