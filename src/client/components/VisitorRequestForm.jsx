import React, { useState, useEffect } from 'react';
import { VisitorService } from '../services/VisitorService.js';

export default function VisitorRequestForm({ visitors, currentUser, onRequestCreated }) {
  const visitorService = new VisitorService();
  const [formData, setFormData] = useState({
    visitor: '',
    host: currentUser?.sys_id || '',
    purpose_of_visit: '',
    visit_reason_details: '',
    requested_start_time: '',
    requested_end_time: '',
    security_escort_required: false,
    access_areas: '',
    parking_required: false,
    parking_spot: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hosts, setHosts] = useState([]);

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    try {
      const response = await fetch('/api/now/table/sys_user?sysparm_query=active=true&sysparm_display_value=all&sysparm_limit=100', {
        headers: {
          'Accept': 'application/json',
          'X-UserToken': window.g_ck
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHosts(data.result || []);
      }
    } catch (error) {
      console.error('Error fetching hosts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate times
      const startTime = new Date(formData.requested_start_time);
      const endTime = new Date(formData.requested_end_time);
      
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }
      
      if (startTime < new Date()) {
        throw new Error('Start time cannot be in the past');
      }

      await visitorService.createVisitorRequest(formData);
      setMessage({ type: 'success', text: 'Visitor request submitted successfully!' });
      
      // Reset form
      setFormData({
        visitor: '',
        host: currentUser?.sys_id || '',
        purpose_of_visit: '',
        visit_reason_details: '',
        requested_start_time: '',
        requested_end_time: '',
        security_escort_required: false,
        access_areas: '',
        parking_required: false,
        parking_spot: ''
      });
      
      if (onRequestCreated) {
        onRequestCreated();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to submit visitor request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-form fade-in">
      <h2>📋 Create Visitor Request</h2>
      
      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="visitor">Visitor *</label>
            <select
              id="visitor"
              name="visitor"
              className="form-select"
              value={formData.visitor}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Visitor</option>
              {visitors.map(visitor => {
                const sysId = typeof visitor.sys_id === 'object' ? visitor.sys_id.value : visitor.sys_id;
                const firstName = typeof visitor.first_name === 'object' ? visitor.first_name.display_value : visitor.first_name;
                const lastName = typeof visitor.last_name === 'object' ? visitor.last_name.display_value : visitor.last_name;
                return (
                  <option key={sysId} value={sysId}>
                    {firstName} {lastName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="host">Host (Employee) *</label>
            <select
              id="host"
              name="host"
              className="form-select"
              value={formData.host}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Host</option>
              {hosts.map(host => {
                const sysId = typeof host.sys_id === 'object' ? host.sys_id.value : host.sys_id;
                const name = typeof host.name === 'object' ? host.name.display_value : host.name;
                return (
                  <option key={sysId} value={sysId}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="purpose_of_visit">Purpose of Visit *</label>
            <select
              id="purpose_of_visit"
              name="purpose_of_visit"
              className="form-select"
              value={formData.purpose_of_visit}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Purpose</option>
              <option value="business_meeting">Business Meeting</option>
              <option value="interview">Interview</option>
              <option value="training">Training/Workshop</option>
              <option value="consultation">Consultation</option>
              <option value="delivery">Delivery/Service</option>
              <option value="tour">Facility Tour</option>
              <option value="contractor">Contractor Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="requested_start_time">Start Time *</label>
            <input
              type="datetime-local"
              id="requested_start_time"
              name="requested_start_time"
              className="form-input"
              value={formData.requested_start_time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="requested_end_time">End Time *</label>
            <input
              type="datetime-local"
              id="requested_end_time"
              name="requested_end_time"
              className="form-input"
              value={formData.requested_end_time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="access_areas">Authorized Access Areas</label>
            <input
              type="text"
              id="access_areas"
              name="access_areas"
              className="form-input"
              value={formData.access_areas}
              onChange={handleInputChange}
              placeholder="e.g., 2nd Floor, Conference Room A"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="visit_reason_details">Visit Details</label>
          <textarea
            id="visit_reason_details"
            name="visit_reason_details"
            className="form-textarea"
            value={formData.visit_reason_details}
            onChange={handleInputChange}
            placeholder="Provide more details about the purpose of the visit"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="security_escort_required"
                checked={formData.security_escort_required}
                onChange={handleInputChange}
              />
              Security Escort Required
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="parking_required"
                checked={formData.parking_required}
                onChange={handleInputChange}
              />
              Parking Required
            </label>
          </div>
        </div>

        {formData.parking_required && (
          <div className="form-group">
            <label className="form-label" htmlFor="parking_spot">Preferred Parking Spot</label>
            <input
              type="text"
              id="parking_spot"
              name="parking_spot"
              className="form-input"
              value={formData.parking_spot}
              onChange={handleInputChange}
              placeholder="e.g., Visitor parking, Level 2"
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Submitting...' : '📤 Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}