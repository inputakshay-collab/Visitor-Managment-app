import React, { useState } from 'react';
import { VisitorService } from '../services/VisitorService.js';

export default function VisitorForm({ onVisitorCreated }) {
  const visitorService = new VisitorService();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    department: '',
    photo_id_type: '',
    photo_id_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    special_requirements: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await visitorService.createVisitor(formData);
      setMessage({ type: 'success', text: 'Visitor registered successfully!' });
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        department: '',
        photo_id_type: '',
        photo_id_number: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        special_requirements: '',
        notes: ''
      });
      
      if (onVisitorCreated) {
        onVisitorCreated();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to register visitor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="visitor-form fade-in">
      <h2>👤 Register New Visitor</h2>
      
      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-input"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="last_name">Last Name *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-input"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company">Company *</label>
            <input
              type="text"
              id="company"
              name="company"
              className="form-input"
              value={formData.company}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              className="form-input"
              value={formData.department}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="photo_id_type">Photo ID Type</label>
            <select
              id="photo_id_type"
              name="photo_id_type"
              className="form-select"
              value={formData.photo_id_type}
              onChange={handleInputChange}
            >
              <option value="">Select ID Type</option>
              <option value="drivers_license">Driver's License</option>
              <option value="passport">Passport</option>
              <option value="government_id">Government ID</option>
              <option value="employee_badge">Employee Badge</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="photo_id_number">Photo ID Number</label>
            <input
              type="text"
              id="photo_id_number"
              name="photo_id_number"
              className="form-input"
              value={formData.photo_id_number}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emergency_contact_name">Emergency Contact Name</label>
            <input
              type="text"
              id="emergency_contact_name"
              name="emergency_contact_name"
              className="form-input"
              value={formData.emergency_contact_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="emergency_contact_phone">Emergency Contact Phone</label>
            <input
              type="tel"
              id="emergency_contact_phone"
              name="emergency_contact_phone"
              className="form-input"
              value={formData.emergency_contact_phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="special_requirements">Special Requirements</label>
          <textarea
            id="special_requirements"
            name="special_requirements"
            className="form-textarea"
            value={formData.special_requirements}
            onChange={handleInputChange}
            placeholder="Any accessibility needs, dietary restrictions, etc."
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            className="form-textarea"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any additional information about the visitor"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Registering...' : '✅ Register Visitor'}
          </button>
        </div>
      </form>
    </div>
  );
}