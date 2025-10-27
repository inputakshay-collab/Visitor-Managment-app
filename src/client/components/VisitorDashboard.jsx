import React, { useState, useEffect } from 'react';
import { VisitorService } from '../services/VisitorService.js';
import VisitorForm from './VisitorForm.jsx';
import VisitorRequestForm from './VisitorRequestForm.jsx';
import CheckInOut from './CheckInOut.jsx';
import DashboardHeader from './DashboardHeader.jsx';
import DataTable from './DataTable.jsx';
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
      <DashboardHeader stats={stats} currentUser={currentUser} />
      
      <div className="dashboard-content">
        {activeView === 'overview' && (
          <div className="overview-content">
            <DataTable
              data={visitorRequests.slice(0, 10)}
              columns={[
                { key: 'number', label: 'Request #', icon: '🔢' },
                { key: 'visitor', label: 'Visitor', type: 'avatar' },
                { key: 'host', label: 'Host', type: 'avatar' },
                { key: 'purpose_of_visit', label: 'Purpose', icon: '📝' },
                { key: 'requested_start_time', label: 'Date & Time', icon: '📅' },
                {
                  key: 'approval_status',
                  label: 'Status',
                  type: 'status',
                  render: (value, row) => (
                    <span className={`status-pill status-${value?.toLowerCase()}`}>
                      {typeof value === 'object' ? value.display_value : value}
                    </span>
                  )
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (_, row) => {
                    const approvalStatus = typeof row.approval_status === 'object' 
                      ? row.approval_status.value 
                      : row.approval_status;
                    const sysId = typeof row.sys_id === 'object' 
                      ? row.sys_id.value 
                      : row.sys_id;
                    
                    return approvalStatus === 'pending' ? (
                      <div className="action-buttons">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprovalChange(sysId, 'approved')}
                        >
                          ✅ Approve
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const reason = prompt('Please provide a reason for rejection:');
                            if (reason?.trim()) {
                              handleApprovalChange(sysId, 'rejected', reason);
                            }
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted">No actions available</span>
                    );
                  }
                }
              ]}
              emptyMessage="No visitor requests found. Create your first request using the 'Create Visit Request' tab."
            />
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