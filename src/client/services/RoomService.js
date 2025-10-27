// Service for managing room booking API calls
export class RoomService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  // Get all meeting rooms
  async getMeetingRooms(filters = {}) {
    try {
      const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_query: 'active=true',
        ...filters
      });
      
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_meeting_room?${params}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch meeting rooms');
      }
      
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching meeting rooms:', error);
      throw error;
    }
  }

  // Get room bookings
  async getRoomBookings(filters = {}) {
    try {
      const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_limit: '100',
        ...filters
      });
      
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_room_booking?${params}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch room bookings');
      }
      
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching room bookings:', error);
      throw error;
    }
  }

  // Create room booking
  async createRoomBooking(bookingData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_room_booking`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create room booking');
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating room booking:', error);
      throw error;
    }
  }

  // Update room booking
  async updateRoomBooking(sysId, bookingData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_room_booking/${sysId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update room booking');
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error updating room booking:', error);
      throw error;
    }
  }

  // Check room availability for a given time period
  async checkRoomAvailability(roomId, startTime, endTime, excludeBookingId = null) {
    try {
      let query = `meeting_room=${roomId}^start_time<=${endTime}^end_time>=${startTime}^booking_statusIN[confirmed,in_progress]`;
      
      if (excludeBookingId) {
        query += `^sys_id!=${excludeBookingId}`;
      }
      
      const params = new URLSearchParams({
        sysparm_query: query,
        sysparm_limit: '1'
      });
      
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_room_booking?${params}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to check room availability');
      }
      
      const data = await response.json();
      return (data.result || []).length === 0; // true if available (no conflicts)
    } catch (error) {
      console.error('Error checking room availability:', error);
      throw error;
    }
  }

  // Delete room booking
  async deleteRoomBooking(sysId) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_room_booking/${sysId}`, {
        method: 'DELETE',
        headers: this.headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete room booking');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting room booking:', error);
      throw error;
    }
  }
}