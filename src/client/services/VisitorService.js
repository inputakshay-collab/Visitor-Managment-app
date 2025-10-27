// Service for managing visitor-related API calls
export class VisitorService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  // Get all visitors
  async getVisitors(filters = {}) {
    try {
      const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_limit: '100',
        ...filters
      });
      
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_visitor?${params}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching visitors:', error);
      throw error;
    }
  }

  // Create a new visitor
  async createVisitor(visitorData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_visitor`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(visitorData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating visitor:', error);
      throw error;
    }
  }

  // Update visitor
  async updateVisitor(sysId, visitorData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_visitor/${sysId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(visitorData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error updating visitor:', error);
      throw error;
    }
  }

  // Get visitor requests
  async getVisitorRequests(filters = {}) {
    try {
      const params = new URLSearchParams({
        sysparm_display_value: 'all',
        sysparm_limit: '100',
        sysparm_order: 'ORDERBYDESCsys_created_on',
        ...filters
      });
      
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_visitor_request?${params}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching visitor requests:', error);
      throw error;
    }
  }

  // Create visitor request
  async createVisitorRequest(requestData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_visitor_request`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Create visitor request error:', errorData);
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();  
      return data.result;
    } catch (error) {
      console.error('Error creating visitor request:', error);
      throw error;
    }
  }

  // Update visitor request (for check-in/out, approvals)
  async updateVisitorRequest(sysId, requestData) {
    try {
      console.log('Updating visitor request:', sysId, requestData);
      
      const response = await fetch(`${this.baseUrl}/x_1248953_vmsystem_visitor_request/${sysId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(requestData)
      });
      
      console.log('Update response status:', response.status);
      
      // Always try to get the response data
      let responseData;
      try {
        responseData = await response.json();
        console.log('Update response data:', responseData);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        responseData = {};
      }
      
      if (!response.ok) {
        // Check if there's an error message in the response
        const errorMessage = responseData.error?.message || 
                            responseData.error?.detail ||
                            `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      return responseData.result;
    } catch (error) {
      console.error('Error updating visitor request:', error);
      throw error;
    }
  }
}