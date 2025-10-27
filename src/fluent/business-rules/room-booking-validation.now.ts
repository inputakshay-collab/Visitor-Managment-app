import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { validateRoomBooking } from '../../server/business-rules/room-booking-validation.js'

// Business rule to validate room bookings and prevent conflicts
export const roomBookingValidationBR = BusinessRule({
    $id: Now.ID['room_booking_validation'],
    name: 'Room Booking Validation',
    table: 'x_1248953_vmsystem_room_booking',
    when: 'before',
    action: ['insert', 'update'],
    script: validateRoomBooking,
    order: 50,
    active: true,
    description: 'Validates room bookings to prevent conflicts and ensure capacity limits'
})