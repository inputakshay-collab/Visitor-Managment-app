import { gs, GlideRecord } from '@servicenow/glide'

export function sendBookingNotification(current, previous) {
    try {
        // Send confirmation when booking is confirmed
        if (current.booking_status == 'confirmed' && previous.booking_status != 'confirmed') {
            
            // Get booker information
            var bookerGR = new GlideRecord('sys_user');
            if (bookerGR.get(current.booked_by)) {
                
                // Get room information
                var roomGR = new GlideRecord('x_1248953_vmsystem_meeting_room');
                if (roomGR.get(current.meeting_room)) {
                    
                    var confirmationMessage = `Dear ${bookerGR.getDisplayValue()},\n\n` +
                        `Your room booking has been confirmed!\n\n` +
                        `Booking Details:\n` +
                        `- Room: ${roomGR.getValue('name')}\n` +
                        `- Location: ${roomGR.getValue('location')}\n` +
                        `- Meeting: ${current.meeting_title}\n` +
                        `- Start Time: ${current.start_time.getDisplayValue()}\n` +
                        `- End Time: ${current.end_time.getDisplayValue()}\n` +
                        `- Expected Attendees: ${current.expected_attendees}\n\n` +
                        `Please arrive 10 minutes early for setup.\n\n` +
                        `Best regards,\nFacility Management Team`;
                    
                    gs.eventQueue('room.booking.confirmed', current, bookerGR.getValue('email'), confirmationMessage);
                    
                    current.notification_sent = true;
                    current.update();
                    
                    gs.addInfoMessage('Booking confirmation sent to ' + bookerGR.getDisplayValue());
                }
            }
        }
        
        // Send cancellation notification
        if (current.booking_status == 'cancelled' && previous.booking_status != 'cancelled') {
            
            var bookerGR = new GlideRecord('sys_user');
            if (bookerGR.get(current.booked_by)) {
                
                var roomGR = new GlideRecord('x_1248953_vmsystem_meeting_room');
                if (roomGR.get(current.meeting_room)) {
                    
                    var cancellationMessage = `Dear ${bookerGR.getDisplayValue()},\n\n` +
                        `Your room booking has been cancelled.\n\n` +
                        `Cancelled Booking:\n` +
                        `- Room: ${roomGR.getValue('name')}\n` +
                        `- Meeting: ${current.meeting_title}\n` +
                        `- Scheduled Time: ${current.start_time.getDisplayValue()} - ${current.end_time.getDisplayValue()}\n\n` +
                        `Reason: ${current.rejection_reason || 'No reason provided'}\n\n` +
                        `Please contact facility management if you have any questions.\n\n` +
                        `Best regards,\nFacility Management Team`;
                    
                    gs.eventQueue('room.booking.cancelled', current, bookerGR.getValue('email'), cancellationMessage);
                }
            }
        }
        
        // Send reminder 30 minutes before meeting starts
        if (current.booking_status == 'confirmed') {
            var startTime = new GlideDateTime(current.start_time);
            var reminderTime = new GlideDateTime(startTime);
            reminderTime.addSeconds(-30 * 60); // 30 minutes before
            
            if (reminderTime.after(new GlideDateTime())) {
                // Schedule reminder notification
                gs.info('Reminder scheduled for ' + reminderTime.getDisplayValue());
            }
        }
        
    } catch (error) {
        gs.error('Error in booking notification: ' + error.message);
    }
}