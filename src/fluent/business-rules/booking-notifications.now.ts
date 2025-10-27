import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { sendBookingNotification } from '../../server/business-rules/booking-notifications.js'

// Business rule to send booking confirmation and cancellation notifications
export const bookingNotificationBR = BusinessRule({
    $id: Now.ID['booking_notifications'],
    name: 'Booking Notifications',
    table: 'x_1248953_vmsystem_room_booking',
    when: 'after',
    action: ['update'],
    script: sendBookingNotification,
    order: 100,
    active: true,
    description: 'Sends email notifications when bookings are confirmed or cancelled'
})