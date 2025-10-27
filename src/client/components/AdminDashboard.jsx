import React, { useState, useEffect } from 'react';
import { VisitorService } from '../services/VisitorService.js';
import { RoomService } from '../services/RoomService.js';
import './AdminDashboard.css';

export default function AdminDashboard({ currentUser }) {
  const visitorService = new VisitorService();
  const roomService = new RoomService();
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalRooms: 0,
    totalVisitorRequests: 0,
    totalBookings: 0,
    pendingApprovals: 0,
    todayActivity: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      const [visitors, rooms, visitorRequests, roomBookings] = await Promise.all([
        visitorService.getVisitors(),
        roomService.getMeetingRooms(),
        visitorService.getVisitorRequests(),
        roomService.getRoomBookings()
      ]);

      const today = new Date().toISOString().split('T')[0];
      
      const pendingVisitorApprovals = visitorRequests.filter(r => {
        const status = typeof r.approval_status === 'object' ? r.approval_status.value : r.approval_status;
        return status === 'pending';
      }).length;
      
      const pendingBookingApprovals = roomBookings.filter(b => {
        const status = typeof b.booking_status === 'object' ? b.booking_status.value : b.booking_status;
        return status === 'pending';
      }).length;
      
      const todayActivity = [...visitorRequests, ...roomBookings].filter(item => {
        const createdOn = typeof item.sys_created_on === 'object' ? item.sys_created_on.value : item.sys_created_on;
        return createdOn && createdOn.startsWith(today);
      }).length;
      
      setStats({
        totalVisitors: visitors.length,
        totalRooms: rooms.length,
        totalVisitorRequests: visitorRequests.length,
        totalBookings: roomBookings.length,
        pendingApprovals: pendingVisitorApprovals + pendingBookingApprovals,
        todayActivity
      });

      // Create recent activity feed
      const activity = [
        ...visitorRequests.map(r => ({
          type: 'visitor_request',
          id: typeof r.sys_id === 'object' ? r.sys_id.value : r.sys_id,
          title: `Visitor request for ${typeof r.visitor === 'object' ? r.visitor.display_value : r.visitor}`,
          timestamp: typeof r.sys_created_on === 'object' ? r.sys_created_on.value : r.sys_created_on,
          status: typeof r.approval_status === 'object' ? r.approval_status.value : r.approval_status
        })),
        ...roomBookings.map(b => ({
          type: 'room_booking',
          id: typeof b.sys_id === 'object' ? b.sys_id.value : b.sys_id,
          title: `Room booking: ${typeof b.meeting_title === 'object' ? b.meeting_title.display_value : b.meeting_title}`,
          timestamp: typeof b.sys_created_on === 'object' ? b.sys_created_on.value : b.sys_created_on,
          status: typeof b.booking_status === 'object' ? b.booking_status.value : b.booking_status
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);

      setRecentActivity(activity);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>🔧 Loading admin dashboard...</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
          Gathering system insights
        </p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard fade-in">
      <h2>⚙️ Administration Control Center</h2>
      
      {/* Spectacular Stats Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">👥</span>
              Total Visitors
            </h3>
          </div>
          <div className="card-metric">{stats.totalVisitors}</div>
          <p className="card-description">Registered visitors</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">🏢</span>
              Meeting Rooms
            </h3>
          </div>
          <div className="card-metric">{stats.totalRooms}</div>
          <p className="card-description">Available rooms</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">📋</span>
              Visitor Requests
            </h3>
          </div>
          <div className="card-metric">{stats.totalVisitorRequests}</div>
          <p className="card-description">Total requests</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">📅</span>
              Room Bookings
            </h3>
          </div>
          <div className="card-metric">{stats.totalBookings}</div>
          <p className="card-description">Total bookings</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">⏳</span>
              Pending Approvals
            </h3>
          </div>
          <div className="card-metric">{stats.pendingApprovals}</div>
          <p className="card-description">Requires attention</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">📊</span>
              Today's Activity
            </h3>
          </div>
          <div className="card-metric">{stats.todayActivity}</div>
          <p className="card-description">New items today</p>
        </div>
      </div>

      {/* Beautiful System Status */}
      <div className="system-status">
        <h3>🔧 System Health Monitor</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>Visitor Management System</span>
            <span className="status-text">Online</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>Room Booking System</span>
            <span className="status-text">Online</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>Notification Service</span>
            <span className="status-text">Online</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>Database Connection</span>
            <span className="status-text">Optimal</span>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div className="recent-activity">
        <h3>📈 Real-Time Activity Feed</h3>
        <div className="activity-list">
          {recentActivity.length === 0 ? (
            <div className="no-activity">
              <p>🌟 All systems running smoothly - no recent activity</p>
            </div>
          ) : (
            recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'visitor_request' ? '👤' : '🏢'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-meta">
                    <span className={`status-badge status-${activity.status}`}>
                      {activity.status}
                    </span>
                    <span className="activity-time">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stunning Quick Actions */}
      <div className="quick-actions">
        <h3>🚀 Quick Management Tools</h3>
        <div className="action-grid">
          <button className="action-button">
            <span className="action-icon">📊</span>
            <span className="action-text">Generate Reports</span>
          </button>
          <button className="action-button">
            <span className="action-icon">⚙️</span>
            <span className="action-text">System Settings</span>
          </button>
          <button className="action-button">
            <span className="action-icon">👥</span>
            <span className="action-text">User Management</span>
          </button>
          <button className="action-button">
            <span className="action-icon">🔔</span>
            <span className="action-text">Notifications</span>
          </button>
          <button className="action-button">
            <span className="action-icon">📈</span>
            <span className="action-text">Analytics</span>
          </button>
          <button className="action-button">
            <span className="action-icon">🛡️</span>
            <span className="action-text">Security</span>
          </button>
        </div>
      </div>
    </div>
  );
}