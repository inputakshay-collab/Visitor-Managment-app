import React, { useState } from 'react';
import {
  Chart as ChartJS,
  import React, { useState, useEffect } from 'react';
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  import React, { useState, useEffect } from 'react';
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
    Filler
  } from 'chart.js';
  import { Line, Bar, Doughnut } from 'react-chartjs-2';
  import './Reports.css';
  import { VisitorService } from '../services/VisitorService';
  import { RoomService } from '../services/RoomService';

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
    ArcElement,
    Filler
  );

  export default function Reports() {
    const [activeTimeframe, setActiveTimeframe] = useState('week');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visitorRequests, setVisitorRequests] = useState([]);
    const [roomBookings, setRoomBookings] = useState([]);

    const visitorService = new VisitorService();
    const roomService = new RoomService();

    useEffect(() => {
      let mounted = true;
      async function loadData() {
        setLoading(true);
        setError(null);
        try {
          const [requests, bookings] = await Promise.all([
            visitorService.getVisitorRequests(),
            roomService.getRoomBookings()
          ]);

          if (!mounted) return;
          setVisitorRequests(Array.isArray(requests) ? requests : []);
          setRoomBookings(Array.isArray(bookings) ? bookings : []);
        } catch (err) {
          console.error('Reports load error:', err);
          if (mounted) setError(err?.message || String(err));
        } finally {
          if (mounted) setLoading(false);
        }
      }

      loadData();

      return () => { mounted = false; };
    }, []);

    const chartOptions = {
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: 'rgba(255, 123, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: 'rgba(255, 123, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6
      }
    }
  };

  // Dummy data for visitor traffic
  const visitorTrafficData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Visitors',
        data: [65, 59, 80, 81, 56, 40, 70],
        borderColor: '#ff7b00',
        backgroundColor: 'rgba(255, 123, 0, 0.1)',
        tension: 0.4,
        fill: 'origin',
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Check-ins',
        data: [45, 50, 60, 70, 45, 30, 50],
        borderColor: '#ffb56b',
        backgroundColor: 'rgba(255, 181, 107, 0.1)',
        tension: 0.4,
        fill: 'origin',
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Dummy data for visitor purpose distribution
  const visitorPurposeData = {
    labels: ['Meeting', 'Interview', 'Delivery', 'Event', 'Other'],
    datasets: [{
      data: [40, 25, 15, 12, 8],
      backgroundColor: [
        'rgba(255, 123, 0, 0.8)',
        'rgba(255, 154, 68, 0.8)',
        'rgba(255, 181, 107, 0.8)',
        'rgba(255, 210, 128, 0.8)',
        'rgba(255, 228, 164, 0.8)'
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // Dummy data for room bookings
  const roomBookingData = {
    labels: ['Meeting Room 1', 'Meeting Room 2', 'Conference Hall', 'Board Room', 'Training Room'],
    datasets: [{
      label: 'Hours Booked',
      data: [25, 18, 30, 22, 15],
      backgroundColor: 'rgba(255, 123, 0, 0.8)',
      borderColor: 'rgba(255, 123, 0, 1)',
      borderWidth: 0,
      borderRadius: 4,
      barThickness: 20,
      hoverBackgroundColor: 'rgba(255, 123, 0, 1)'
    }]
  };
        {loading && <div className="reports-loading">Loading reports…</div>}
        {error && <div className="reports-error">Error loading reports: {error}</div>}

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

        <div style={{ height: '400px', marginTop: '1rem', position: 'relative' }}>
          <Line 
            data={visitorTrafficData} 
            options={chartOptions}
            redraw={false}
          />
        </div>
      </div>

      <div className="reports-grid" style={{ marginTop: '2rem' }}>
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Visitor Purpose Distribution</div>
          </div>
          <div style={{ height: '300px', padding: '1rem', position: 'relative' }}>
            <Doughnut 
              data={visitorPurposeData} 
              options={doughnutOptions}
              redraw={false}
            />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Room Usage (Hours)</div>
          </div>
          <div style={{ height: '300px', padding: '1rem', position: 'relative' }}>
            <Bar 
              data={roomBookingData} 
              options={chartOptions}
              redraw={false}
            />
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
              {visitorRequests && visitorRequests.length > 0 ? (
                visitorRequests.slice(0, 10).map((v, idx) => (
                  <tr key={v.sys_id || idx}>
                    <td>{v.visitor_name || v.name || v.display_value || v.requested_for || 'Unknown'}</td>
                    <td>{v.purpose || v.visit_purpose || v.short_description || '—'}</td>
                    <td>{(v.sys_created_on || v.expected_start || v.start_time) ? new Date(v.sys_created_on || v.expected_start || v.start_time).toLocaleString() : '—'}</td>
                    <td>
                      <span className={`status-badge ${v.state === 'checked_out' || v.status === 'checked_out' ? 'status-checked-out' : 'status-checked-in'}`}>
                        {v.state || v.status || (v.checked_in ? 'Checked In' : 'Pending')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>No recent activity to display</td>
                </tr>
              )}
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
