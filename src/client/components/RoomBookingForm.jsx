import React, { useState } from 'react';
import { RoomService } from '../services/RoomService.js';

export default function RoomBookingForm({ rooms, currentUser, onBookingCreated }) {
  const roomService = new RoomService();
  const [formData, setFormData] = useState({
    meeting_room: '',
    booked_by: currentUser?.sys_id || '',
    meeting_title: '',
    meeting_purpose: '',
    start_time: '',
    end_time: '',
    expected_attendees: '',
    setup_requirements: '',
    catering_required: false,
    catering_details: '',
    av_equipment_needed: '',
    recurring_booking: false,
    recurring_pattern: '',
    attendees_list: '',
    meeting_notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [availabilityCheck, setAvailabilityCheck] = useState({ checked: false, available: false });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Reset availability check when room or time changes
    if (['meeting_room', 'start_time', 'end_time'].includes(name)) {
      setAvailabilityCheck({ checked: false, available: false });
    }
  };

  const checkAvailability = async () => {
    if (!formData.meeting_room || !formData.start_time || !formData.end_time) {
      setMessage({ type: 'error', text: 'Please select room and time first' });
      return;
    }

    try {
      const available = await roomService.checkRoomAvailability(
        formData.meeting_room,
        formData.start_time,
        formData.end_time
      );
      
      setAvailabilityCheck({ checked: true, available });
      setMessage({ 
        type: available ? 'success' : 'error', 
        text: available ? '✅ Room is available for the selected time' : '❌ Room is not available for the selected time'
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to check availability' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate times
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);
      
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }
      
      if (startTime < new Date()) {
        throw new Error('Start time cannot be in the past');
      }

      // Check availability first
      const available = await roomService.checkRoomAvailability(
        formData.meeting_room,
        formData.start_time,
        formData.end_time
      );

      if (!available) {
        throw new Error('Room is not available for the selected time');
      }

      await roomService.createRoomBooking(formData);
      setMessage({ type: 'success', text: 'Room booking created successfully!' });
      
      // Reset form
      setFormData({
        meeting_room: '',
        booked_by: currentUser?.sys_id || '',
        meeting_title: '',
        meeting_purpose: '',
        start_time: '',
        end_time: '',
        expected_attendees: '',
        setup_requirements: '',
        catering_required: false,
        catering_details: '',
        av_equipment_needed: '',
        recurring_booking: false,
        recurring_pattern: '',
        attendees_list: '',
        meeting_notes: ''
      });
      
      setAvailabilityCheck({ checked: false, available: false });
      
      if (onBookingCreated) {
        onBookingCreated();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create room booking' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form fade-in">
      <h2>📝 Book Meeting Room</h2>
      
      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="meeting_room">Meeting Room *</label>
            <select
              id="meeting_room"
              name="meeting_room"
              className="form-select"
              value={formData.meeting_room}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Room</option>
              {rooms.filter(room => {
                const status = typeof room.status === 'object' ? room.status.value : room.status;
                return status === 'available';
              }).map(room => {
                const sysId = typeof room.sys_id === 'object' ? room.sys_id.value : room.sys_id;
                const name = typeof room.name === 'object' ? room.name.display_value : room.name;
                const capacity = typeof room.capacity === 'object' ? room.capacity.display_value : room.capacity;
                const location = typeof room.location === 'object' ? room.location.display_value : room.location;
                return (
                  <option key={sysId} value={sysId}>
                    {name} - {location} (Capacity: {capacity})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meeting_title">Meeting Title *</label>
            <input
              type="text"
              id="meeting_title"
              name="meeting_title"
              className="form-input"
              value={formData.meeting_title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="start_time">Start Time *</label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              className="form-input"
              value={formData.start_time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="end_time">End Time *</label>
            <input
              type="datetime-local"
              id="end_time"
              name="end_time"
              className="form-input"
              value={formData.end_time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="expected_attendees">Expected Attendees *</label>
            <input
              type="number"
              id="expected_attendees"
              name="expected_attendees"
              className="form-input"
              value={formData.expected_attendees}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={checkAvailability}
              disabled={!formData.meeting_room || !formData.start_time || !formData.end_time}
            >
              🔍 Check Availability
            </button>
            {availabilityCheck.checked && (
              <div className={`availability-result ${availabilityCheck.available ? 'available' : 'unavailable'}`}>
                {availabilityCheck.available ? '✅ Available' : '❌ Not Available'}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="meeting_purpose">Meeting Purpose</label>
          <textarea
            id="meeting_purpose"
            name="meeting_purpose"
            className="form-textarea"
            value={formData.meeting_purpose}
            onChange={handleInputChange}
            placeholder="Brief description of the meeting purpose"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="attendees_list">Attendee List</label>
          <textarea
            id="attendees_list"
            name="attendees_list"
            className="form-textarea"
            value={formData.attendees_list}
            onChange={handleInputChange}
            placeholder="List of attendees (optional)"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="setup_requirements">Setup Requirements</label>
            <input
              type="text"
              id="setup_requirements"
              name="setup_requirements"
              className="form-input"
              value={formData.setup_requirements}
              onChange={handleInputChange}
              placeholder="e.g., U-shape seating, presentation setup"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="av_equipment_needed">AV Equipment Needed</label>
            <input
              type="text"
              id="av_equipment_needed"
              name="av_equipment_needed"
              className="form-input"
              value={formData.av_equipment_needed}
              onChange={handleInputChange}
              placeholder="e.g., Projector, Microphone, Laptop"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="catering_required"
                checked={formData.catering_required}
                onChange={handleInputChange}
              />
              Catering Required
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="recurring_booking"
                checked={formData.recurring_booking}
                onChange={handleInputChange}
              />
              Recurring Booking
            </label>
          </div>
        </div>

        {formData.catering_required && (
          <div className="form-group">
            <label className="form-label" htmlFor="catering_details">Catering Details</label>
            <textarea
              id="catering_details"
              name="catering_details"
              className="form-textarea"
              value={formData.catering_details}
              onChange={handleInputChange}
              placeholder="Specify catering requirements"
            />
          </div>
        )}

        {formData.recurring_booking && (
          <div className="form-group">
            <label className="form-label" htmlFor="recurring_pattern">Recurring Pattern</label>
            <select
              id="recurring_pattern"
              name="recurring_pattern"
              className="form-select"
              value={formData.recurring_pattern}
              onChange={handleInputChange}
            >
              <option value="">Select Pattern</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="meeting_notes">Additional Notes</label>
          <textarea
            id="meeting_notes"
            name="meeting_notes"
            className="form-textarea"
            value={formData.meeting_notes}
            onChange={handleInputChange}
            placeholder="Any additional information or special requests"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading || !availabilityCheck.available}>
            {loading ? '⏳ Booking...' : '📅 Book Room'}
          </button>
        </div>
      </form>
    </div>
  );
}