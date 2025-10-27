import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// Visitor Management Admin role - full access to all visitor management features
export const visitor_admin = Role({
    name: 'x_1248953_vmsystem.visitor_admin',
    description: 'Full access to visitor management system - can manage all bookings, approvals, and configurations'
})

// Visitor Management User role - can create and manage their own bookings
export const visitor_user = Role({
    name: 'x_1248953_vmsystem.visitor_user',
    description: 'Standard user access - can create visitor requests and room bookings for themselves'
})

// Security role - can check visitors in/out and view visitor information
export const security_guard = Role({
    name: 'x_1248953_vmsystem.security_guard',
    description: 'Security personnel role - can manage visitor check-in/check-out and view visitor status'
})

// Facility Manager role - can manage room configurations and view occupancy
export const facility_manager = Role({
    name: 'x_1248953_vmsystem.facility_manager',
    description: 'Facility management role - can manage meeting rooms, view occupancy reports, and approve bookings'
})

// Approver role - can approve visitor requests and room bookings
export const approver = Role({
    name: 'x_1248953_vmsystem.approver',
    description: 'Approval role - can approve or reject visitor requests and room bookings'
})