import React, { useState } from 'react';
import { VisitorService } from '../services/VisitorService.js';

export default function CheckInOut({ visitorRequests, onStatusChange }) {
  const visitorService = new VisitorService();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Filter for approved requests that are not completed
  const checkInEligibleRequests = visitorRequests.filter(request => {
    const approvalStatus = typeof request.approval_status === 'object' ? request.approval_status.value : request.approval_status;
    const checkInStatus = typeof request.check_in_status === 'object' ? request.check_in_status.value : request.check_in_status;
    return approvalStatus === 'approved' && ['not_arrived', 'checked_in'].includes(checkInStatus);
  });

  const handleCheckIn = async (requestId) => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Use proper ServiceNow datetime format
      const now = new Date();
      const serviceNowDateTime = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      await visitorService.updateVisitorRequest(requestId, {
        check_in_status: 'checked_in',
        actual_arrival_time: serviceNowDateTime
      });

      setMessage({ type: 'success', text: '✅ Visitor checked in successfully!' });
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error('Check-in error:', error);
      setMessage({ type: 'error', text: `❌ Failed to check in visitor: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (requestId) => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Use proper ServiceNow datetime format
      const now = new Date();
      const serviceNowDateTime = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      await visitorService.updateVisitorRequest(requestId, {
        check_in_status: 'checked_out',
        actual_departure_time: serviceNowDateTime
      });

      setMessage({ type: 'success', text: '🚪 Visitor checked out successfully!' });
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error('Check-out error:', error);
      setMessage({ type: 'error', text: `❌ Failed to check out visitor: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not set';
    try {
      const dateTime = typeof dateTimeString === 'object' ? dateTimeString.display_value : dateTimeString;
      return new Date(dateTime).toLocaleString();
    } catch {
      return dateTimeString;
    }
  };

  return (
    <div className="checkin-out fade-in">
      <h2>🚪 Visitor Check-In/Check-Out Station</h2>
      
      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

      {checkInEligibleRequests.length === 0 ? (
        <div className="no-visitors">
          <p>📭 No approved visitors scheduled for check-in/check-out at this time.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.7 }}>
            Visitors must be approved before they can check in.
          </p>
        </div>
      ) : (
        <div className="checkin-list">
          {checkInEligibleRequests.map(request => {
            const sysId = typeof request.sys_id === 'object' ? request.sys_id.value : request.sys_id;
            const number = typeof request.number === 'object' ? request.number.display_value : request.number;
            const visitor = typeof request.visitor === 'object' ? request.visitor.display_value : request.visitor;
            const host = typeof request.host === 'object' ? request.host.display_value : request.host;
            const purpose = typeof request.purpose_of_visit === 'object' ? request.purpose_of_visit.display_value : request.purpose_of_visit;
            const checkInStatus = typeof request.check_in_status === 'object' ? request.check_in_status.value : request.check_in_status;
            const checkInStatusDisplay = typeof request.check_in_status === 'object' ? request.check_in_status.display_value : request.check_in_status;
            const startTime = formatDateTime(request.requested_start_time);
            const endTime = formatDateTime(request.requested_end_time);
            const arrivalTime = formatDateTime(request.actual_arrival_time);
            
            return (
              <div key={sysId} className={`checkin-card ${checkInStatus}`}>
                <div className="checkin-header">
                  <div className="visitor-info">
                    <h4>👤 {visitor}</h4>
                    <p><strong>Request #:</strong> {number}</p>
                    <p><strong>Host:</strong> {host}</p>
                    <p><strong>Purpose:</strong> {purpose}</p>
                    <p><strong>Scheduled:</strong> {startTime} - {endTime}</p>
                    {arrivalTime !== 'Not set' && (
                      <p><strong>✅ Arrived:</strong> {arrivalTime}</p>
                    )}
                  </div>
                  <div className="checkin-status">
                    <span className={`status-badge status-${checkInStatus.replace('_', '-')}`}>
                      {checkInStatusDisplay}
                    </span>
                  </div>
                </div>
                
                <div className="checkin-actions">
                  {checkInStatus === 'not_arrived' && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleCheckIn(sysId)}
                      disabled={loading}
                      title="Check in this visitor"
                    >
                      {loading ? '⏳ Checking In...' : '✅ Check In Visitor'}
                    </button>
                  )}
                  
                  {checkInStatus === 'checked_in' && (
                    <button
                      className="btn btn-warning"
                      onClick={() => handleCheckOut(sysId)}
                      disabled={loading}
                      title="Check out this visitor"
                    >
                      {loading ? '⏳ Checking Out...' : '🚪 Check Out Visitor'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}