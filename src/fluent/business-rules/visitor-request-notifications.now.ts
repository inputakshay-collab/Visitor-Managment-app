import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { sendVisitorRequestNotification } from '../../server/business-rules/visitor-request-notifications.js'

// Business rule to send notifications when visitor requests are approved or rejected
export const visitorRequestNotificationBR = BusinessRule({
    $id: Now.ID['visitor_request_notifications'],
    name: 'Visitor Request Notifications',
    table: 'x_1248953_vmsystem_visitor_request',
    when: 'after',
    action: ['update'],
    script: sendVisitorRequestNotification,
    order: 100,
    active: true,
    description: 'Sends email notifications to visitors and hosts when requests are approved or rejected'
})