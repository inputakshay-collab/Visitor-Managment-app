import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import visitorManagementPage from '../../client/index.html'

// Main visitor management system UI page
export const visitor_management_ui = UiPage({
    $id: Now.ID['visitor_management_ui'],
    endpoint: 'x_1248953_vmsystem_visitor_mgmt.do',
    description: 'Visitor & Meeting Room Booking Concierge - Modern interface for managing visitors, room bookings, approvals, and facility operations',
    category: 'general',
    html: visitorManagementPage,
    direct: true
})