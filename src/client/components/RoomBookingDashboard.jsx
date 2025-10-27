import React, { useState, useEffect } from 'react';
import { RoomService } from '../services/RoomService.js';
import RoomBookingForm from './RoomBookingForm.jsx';

export default function RoomBookingDashboard({ currentUser }) {
  const roomService = new RoomService();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    todayBookings: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get rooms and bookings
      const [roomList, bookingList] = await Promise.all([
        roomService.getMeetingRooms(),
        roomService.getRoomBookings()
      ]);
      
      setRooms(roomList);
      setBookings(bookingList);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const availableRooms = roomList.filter(room => {
        const status = typeof room.status === 'object' ? room.status.value : room.status;
        return status === 'available';
      }).length;
      
      const todayBookings = bookingList.filter(booking => {
        const startTime = typeof booking.start_time === 'object' ? booking.start_time.value : booking.start_time;
        return startTime && startTime.startsWith(today);
      }).length;
      
      const pendingApprovals = bookingList.filter(booking => {
        const status = typeof booking.booking_status === 'object' ? booking.booking_status.value : booking.booking_status;
        return status === 'pending';
      }).length;
      
      setStats({
        totalRooms: roomList.length,
        availableRooms,
        todayBookings,
        pendingApprovals
      });
      
    } catch (error) {
      console.error('Error loading room dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus, reason = '') => {
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
        booking_status: newStatus,
        approved_by: currentUserSysId,
        approval_date: serviceNowDateTime
      };
      
      if (reason && reason.trim()) {
        updateData.rejection_reason = reason.trim();
      }

      console.log('Updating booking with data:', updateData);
      
      await roomService.updateRoomBooking(bookingId, updateData);
      
      // Show success message
      const statusText = newStatus === 'confirmed' ? 'confirmed' : 'cancelled';
      alert(`✅ Room booking has been ${statusText} successfully!`);
      
      // Reload data
      loadDashboardData();
      
    } catch (error) {
      console.error('Error updating booking status:', error);
      
      // Show detailed error message
      let errorMessage = 'Failed to update booking status';
      if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      alert('❌ ' + errorMessage);
    }
  };

  const handleBookingCreated = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>🏢 Loading room booking dashboard...</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
          Preparing room availability data
        </p>
      </div>
    );
  }

  return (
    <div className="room-dashboard fade-in">
      {/* Stats Overview */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">🏢</span>
              Total Rooms
            </h3>
          </div>
          <div className="card-metric">{stats.totalRooms}</div>
          <p className="card-description">Meeting rooms available</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">✅</span>
              Available Now
            </h3>
          </div>
          <div className="card-metric">{stats.availableRooms}</div>
          <p className="card-description">Ready for booking</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">📅</span>
              Today's Bookings
            </h3>
          </div>
          <div className="card-metric">{stats.todayBookings}</div>
          <p className="card-description">Meetings scheduled</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">⏳</span>
              Pending Approvals
            </h3>
          </div>
          <div className="card-metric">{stats.pendingApprovals}</div>
          <p className="card-description">Awaiting approval</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-bar">
        <button 
          className={`btn ${activeView === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('overview')}
        >
          📊 Booking Overview
        </button>
        <button 
          className={`btn ${activeView === 'rooms' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('rooms')}
        >
          🏢 Room Directory
        </button>
        <button 
          className={`btn ${activeView === 'book' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('book')}
        >
          📝 Book New Room
        </button>
        <button 
          className={`btn ${activeView === 'schedule' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('schedule')}
        >
          📅 Today's Schedule
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeView === 'overview' && (
          <div className="overview-content">
            <h2>🎯 Recent Room Bookings</h2>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Room</th>
                    <th>Meeting Title</th>
                    <th>Booked By</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        📭 No room bookings found. Create your first booking using the "Book New Room" tab.
                      </td>
                    </tr>
                  ) : (
                    bookings.slice(0, 10).map(booking => {
                      const number = typeof booking.number === 'object' ? booking.number.display_value : booking.number;
                      const room = typeof booking.meeting_room === 'object' ? booking.meeting_room.display_value : booking.meeting_room;
                      const title = typeof booking.meeting_title === 'object' ? booking.meeting_title.display_value : booking.meeting_title;
                      const bookedBy = typeof booking.booked_by === 'object' ? booking.booked_by.display_value : booking.booked_by;
                      const startTime = typeof booking.start_time === 'object' ? booking.start_time.display_value : booking.start_time;
                      const bookingStatus = typeof booking.booking_status === 'object' ? booking.booking_status.value : booking.booking_status;
                      const bookingStatusDisplay = typeof booking.booking_status === 'object' ? booking.booking_status.display_value : booking.booking_status;
                      const sysId = typeof booking.sys_id === 'object' ? booking.sys_id.value : booking.sys_id;
                      
                      return (
                        <tr key={sysId}>
                          <td><strong>{number}</strong></td>
                          <td>{room}</td>
                          <td>{title}</td>
                          <td>{bookedBy}</td>
                          <td>{startTime}</td>
                          <td>
                            <span className={`status-badge status-${bookingStatus}`}>
                              {bookingStatusDisplay}
                            </span>
                          </td>
                          <td>
                            {bookingStatus === 'pending' && (
                              <div className="action-buttons">
                                <button 
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleBookingStatusChange(sysId, 'confirmed')}
                                  title="Confirm this room booking"
                                >
                                  ✅ Confirm
                                </button>
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    const reason = prompt('Please provide a reason for cancellation:');
                                    if (reason && reason.trim()) {
                                      handleBookingStatusChange(sysId, 'cancelled', reason);
                                    } else if (reason === '') {
                                      alert('Please provide a cancellation reason.');
                                    }
                                  }}
                                  title="Cancel this room booking"
                                >
                                  ❌ Cancel
                                </button>
                              </div>
                            )}
                            {bookingStatus !== 'pending' && (
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
        
        {activeView === 'rooms' && (
          <div className="rooms-content">
            <h2>🏢 Meeting Room Directory</h2>
            <div className="room-grid">
              {rooms.map(room => {
                const sysId = typeof room.sys_id === 'object' ? room.sys_id.value : room.sys_id;
                const name = typeof room.name === 'object' ? room.name.display_value : room.name;
                const location = typeof room.location === 'object' ? room.location.display_value : room.location;
                const capacity = typeof room.capacity === 'object' ? room.capacity.display_value : room.capacity;
                const roomType = typeof room.room_type === 'object' ? room.room_type.display_value : room.room_type;
                const status = typeof room.status === 'object' ? room.status.value : room.status;
                const statusDisplay = typeof room.status === 'object' ? room.status.display_value : room.status;
                const amenities = typeof room.amenities === 'object' ? room.amenities.display_value : room.amenities;
                
                return (
                  <div key={sysId} className="room-card">
                    <div className="room-header">
                      <h3>🏢 {name}</h3>
                      <span className={`status-badge status-${status}`}>
                        {statusDisplay}
                      </span>
                    </div>
                    <div className="room-details">
                      <p><strong>📍 Location:</strong> {location}</p>
                      <p><strong>👥 Capacity:</strong> {capacity} people</p>
                      <p><strong>🏷️ Type:</strong> {roomType}</p>
                      <p><strong>🎯 Amenities:</strong> {amenities}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {activeView === 'book' && (
          <RoomBookingForm 
            rooms={rooms}
            currentUser={currentUser}
            onBookingCreated={handleBookingCreated}
          />
        )}
        
        {activeView === 'schedule' && (
          <div className="schedule-content">
            <h2>📅 Today's Room Schedule</h2>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Meeting</th>
                    <th>Organizer</th>
                    <th>Attendees</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter(booking => {
                      const status = typeof booking.booking_status === 'object' ? booking.booking_status.value : booking.booking_status;
                      const startTime = typeof booking.start_time === 'object' ? booking.start_time.value : booking.start_time;
                      const today = new Date().toISOString().split('T')[0];
                      return ['confirmed', 'in_progress'].includes(status) && startTime && startTime.startsWith(today);
                    })
                    .sort((a, b) => {
                      const timeA = typeof a.start_time === 'object' ? a.start_time.value : a.start_time;
                      const timeB = typeof b.start_time === 'object' ? b.start_time.value : b.start_time;
                      return new Date(timeA) - new Date(timeB);
                    })
                    .map(booking => {
                      const sysId = typeof booking.sys_id === 'object' ? booking.sys_id.value : booking.sys_id;
                      const room = typeof booking.meeting_room === 'object' ? booking.meeting_room.display_value : booking.meeting_room;
                      const title = typeof booking.meeting_title === 'object' ? booking.meeting_title.display_value : booking.meeting_title;
                      const bookedBy = typeof booking.booked_by === 'object' ? booking.booked_by.display_value : booking.booked_by;
                      const startTime = typeof booking.start_time === 'object' ? booking.start_time.display_value : booking.start_time;
                      const endTime = typeof booking.end_time === 'object' ? booking.end_time.display_value : booking.end_time;
                      const attendees = typeof booking.expected_attendees === 'object' ? booking.expected_attendees.display_value : booking.expected_attendees;
                      const status = typeof booking.booking_status === 'object' ? booking.booking_status.value : booking.booking_status;
                      const statusDisplay = typeof booking.booking_status === 'object' ? booking.booking_status.display_value : booking.booking_status;
                      
                      return (
                        <tr key={sysId}>
                          <td><strong>{startTime} - {endTime}</strong></td>
                          <td>🏢 {room}</td>
                          <td>{title}</td>
                          <td>{bookedBy}</td>
                          <td>👥 {attendees}</td>
                          <td>
                            <span className={`status-badge status-${status}`}>
                              {statusDisplay}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  {bookings.filter(booking => {
                    const status = typeof booking.booking_status === 'object' ? booking.booking_status.value : booking.booking_status;
                    const startTime = typeof booking.start_time === 'object' ? booking.start_time.value : booking.start_time;
                    const today = new Date().toISOString().split('T')[0];
                    return ['confirmed', 'in_progress'].includes(status) && startTime && startTime.startsWith(today);
                  }).length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        📅 No confirmed meetings scheduled for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}