import { gs, GlideRecord } from '@servicenow/glide'

export function validateRoomBooking(current, previous) {
    try {
        // Only validate on insert or when time/room changes
        if (gs.action !== 'insert' && 
            previous.meeting_room == current.meeting_room &&
            previous.start_time == current.start_time &&
            previous.end_time == current.end_time) {
            return;
        }

        // Check for overlapping bookings
        var conflictGR = new GlideRecord('x_1248953_vmsystem_room_booking');
        conflictGR.addQuery('meeting_room', current.meeting_room);
        conflictGR.addQuery('start_time', '<=', current.end_time);
        conflictGR.addQuery('end_time', '>=', current.start_time);
        conflictGR.addQuery('booking_status', 'IN', 'confirmed,in_progress');
        conflictGR.addQuery('sys_id', '!=', current.sys_id); // Exclude current record
        conflictGR.query();
        
        if (conflictGR.hasNext()) {
            conflictGR.next();
            var conflictTitle = conflictGR.getValue('meeting_title');
            gs.addErrorMessage('Room booking conflict detected. The room is already booked for "' + conflictTitle + '" during this time period.');
            current.setAbortAction(true);
            return false;
        }

        // Validate room capacity
        var roomGR = new GlideRecord('x_1248953_vmsystem_meeting_room');
        if (roomGR.get(current.meeting_room)) {
            var roomCapacity = parseInt(roomGR.getValue('capacity'));
            var expectedAttendees = parseInt(current.expected_attendees);
            
            if (expectedAttendees > roomCapacity) {
                gs.addErrorMessage('Expected attendees (' + expectedAttendees + ') exceeds room capacity (' + roomCapacity + ').');
                current.setAbortAction(true);
                return false;
            }
        }

        // Check if room is available
        var roomGR = new GlideRecord('x_1248953_vmsystem_meeting_room');
        if (roomGR.get(current.meeting_room)) {
            if (roomGR.getValue('status') != 'available') {
                gs.addErrorMessage('Room is not available for booking at this time.');
                current.setAbortAction(true);
                return false;
            }
        }

        // Validate booking time is in the future
        var startTime = new GlideDateTime(current.start_time);
        var now = new GlideDateTime();
        
        if (startTime.before(now)) {
            gs.addErrorMessage('Cannot book rooms for past times.');
            current.setAbortAction(true);
            return false;
        }

        // Validate end time is after start time
        var endTime = new GlideDateTime(current.end_time);
        if (endTime.before(startTime) || endTime.equals(startTime)) {
            gs.addErrorMessage('End time must be after start time.');
            current.setAbortAction(true);
            return false;
        }

        gs.addInfoMessage('Room booking validation completed successfully.');
        
    } catch (error) {
        gs.error('Error in room booking validation: ' + error.message);
    }
}