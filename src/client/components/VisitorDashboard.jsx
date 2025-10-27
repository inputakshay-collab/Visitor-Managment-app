import React, { useState, useEffect } from 'react';
import { VisitorService } from '../services/VisitorService.js';
import VisitorForm from './VisitorForm.jsx';
import VisitorRequestForm from './VisitorRequestForm.jsx';
import CheckInOut from './CheckInOut.jsx';
import './VisitorDashboard.css';

export default function VisitorDashboard({ currentUser }) {
  const visitorService = new VisitorService();
  const [visitors, setVisitors] = useState([]);
  const [visitorRequests, setVisitorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [stats, setStats] = useState({
    totalVisitors: 0,
    pendingRequests: 0,
    checkedInToday: 0,
    approvedToday: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get visitor requests
      const requests = await visitorService.getVisitorRequests();
      setVisitorRequests(requests);
      
      // Get visitors
      const visitorList = await visitorService.getVisitors();
      setVisitors(visitorList);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const pending = requests.filter(r => {
        const status = typeof r.approval_status === 'object' ? r.approval_status.value : r.approval_status;
        return status === 'pending';
      }).length;
      
      const checkedIn = requests.filter(r => {
        const status = typeof r.check_in_status === 'object' ? r.check_in_status.value : r.check_in_status;
        const arrivalTime = typeof r.actual_arrival_time === 'object' ? r.actual_arrival_time.value : r.actual_arrival_time;
        return status === 'checked_in' && arrivalTime && arrivalTime.startsWith(today);
      }).length;
      
      const approved = requests.filter(r => {
        const status = typeof r.approval_status === 'object' ? r.approval_status.value : r.approval_status;
        const approvalDate = typeof r.approval_date === 'object' ? r.approval_date.value : r.approval_date;
        return status === 'approved' && approvalDate && approvalDate.startsWith(today);
      }).length;
      
      setStats({
        totalVisitors: visitorList.length,
        pendingRequests: pending,
        checkedInToday: checkedIn,
        approvedToday: approved
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCreated = () => {
    loadDashboardData();
  };

  const handleApprovalChange = async (requestId, newStatus, reason = '') => {
    try {
      // Extract the current user's sys_id properly
      const currentUserSysId = typeof currentUser?.sys_id === 'object' ? 
        currentUser.sys_id.value : 
        currentUser?.sys_id;

      if (!currentUserSysId) {
        throw new Error('Current user information not available');
      }

      // Prepare update data with proper ServiceNow date format
      const now = new Date();
      const serviceNowDateTime = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      const updateData = {
        approval_status: newStatus,
        approved_by: currentUserSysId,
        approval_date: serviceNowDateTime
      };
      
      if (reason && reason.trim()) {
        updateData.rejection_reason = reason.trim();
      }

      console.log('Updating request with data:', updateData);
      
      await visitorService.updateVisitorRequest(requestId, updateData);
      
      // Show success message
      const statusText = newStatus === 'approved' ? 'approved' : 'rejected';
      alert(`✅ Visitor request has been ${statusText} successfully!`);
      
      // Reload data
      loadDashboardData();
      
    } catch (error) {
      console.error('Error updating approval:', error);
      
      // Show detailed error message
      let errorMessage = 'Failed to update approval status';
      if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      alert('❌ ' + errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>✨ Loading visitor dashboard...</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
          Preparing your data with style
        </p>
      </div>
    );
  }

  return (
    <div className="visitor-dashboard fade-in">
      {/* Beautiful Stats Overview */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">👥</span>
              Total Visitors
            </h3>
          </div>
          <div className="card-metric">{stats.totalVisitors}</div>
          <p className="card-description">Registered in the system</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">⏳</span>
              Pending Requests
            </h3>
          </div>
          <div className="card-metric">{stats.pendingRequests}</div>
          <p className="card-description">Awaiting your approval</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">✅</span>
              Checked In Today
            </h3>
          </div>
          <div className="card-metric">{stats.checkedInToday}</div>
          <p className="card-description">Currently on premises</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">📝</span>
              Approved Today
            </h3>
          </div>
          <div className="card-metric">{stats.approvedToday}</div>
          <p className="card-description">New approvals granted</p>
        </div>
      </div>

      {/* Premium Action Buttons */}
      <div className="action-bar">
        <button 
          className={`btn ${activeView === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('overview')}
        >
          📊 Dashboard Overview
        </button>
        <button 
          className={`btn ${activeView === 'register' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('register')}
        >
          👤 Register New Visitor
        </button>
        <button 
          className={`btn ${activeView === 'request' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('request')}
        >
          📋 Create Visit Request
        </button>
        <button 
          className={`btn ${activeView === 'checkin' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('checkin')}
        >
          🚪 Visitor Check-In/Out
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeView === 'overview' && (
          <div className="overview-content">
            <h2>🎯 Recent Visitor Requests</h2>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Request #</th>
                    <th>Visitor</th>
                    <th>Host</th>
                    <th>Purpose</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visitorRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        📭 No visitor requests found. Create your first request using the "Create Visit Request" tab.
                      </td>
                    </tr>
                  ) : (
                    visitorRequests.slice(0, 10).map(request => {
                      const number = typeof request.number === 'object' ? request.number.display_value : request.number;
                      const visitor = typeof request.visitor === 'object' ? request.visitor.display_value : request.visitor;
                      const host = typeof request.host === 'object' ? request.host.display_value : request.host;
                      const purpose = typeof request.purpose_of_visit === 'object' ? request.purpose_of_visit.display_value : request.purpose_of_visit;
                      const startTime = typeof request.requested_start_time === 'object' ? request.requested_start_time.display_value : request.requested_start_time;
                      const approvalStatus = typeof request.approval_status === 'object' ? request.approval_status.value : request.approval_status;
                      const approvalStatusDisplay = typeof request.approval_status === 'object' ? request.approval_status.display_value : request.approval_status;
                      const sysId = typeof request.sys_id === 'object' ? request.sys_id.value : request.sys_id;
                      
                      return (
                        <tr key={sysId}>
                          <td><strong>{number}</strong></td>
                          <td>{visitor}</td>
                          <td>{host}</td>
                          <td>{purpose}</td>
                          <td>{startTime}</td>
                          <td>
                            <span className={`status-badge status-${approvalStatus}`}>
                              {approvalStatusDisplay}
                            </span>
                          </td>
                          <td>
                            {approvalStatus === 'pending' && (
                              <div className="action-buttons">
                                <button 
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleApprovalChange(sysId, 'approved')}
                                  title="Approve this visitor request"
                                >
                                  ✅ Approve
                                </button>
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    const reason = prompt('Please provide a reason for rejection:');
                                    if (reason && reason.trim()) {
                                      handleApprovalChange(sysId, 'rejected', reason);
                                    } else if (reason === '') {
                                      alert('Please provide a rejection reason.');
                                    }
                                  }}
                                  title="Reject this visitor request"
                                >
                                  ❌ Reject
                                </button>
                              </div>
                            )}
                            {approvalStatus !== 'pending' && (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                No actions available
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeView === 'register' && (
          <VisitorForm onVisitorCreated={loadDashboardData} />
        )}
        
        {activeView === 'request' && (
          <VisitorRequestForm 
            visitors={visitors}
            currentUser={currentUser}
            onRequestCreated={handleRequestCreated}
          />
        )}
        
        {activeView === 'checkin' && (
          <CheckInOut
            visitorRequests={visitorRequests}
            onStatusChange={loadDashboardData}
          />
        )}
      </div>
    </div>
  );
}