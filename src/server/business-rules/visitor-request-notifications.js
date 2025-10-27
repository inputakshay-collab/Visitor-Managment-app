import { gs, GlideRecord } from '@servicenow/glide'

export function sendVisitorRequestNotification(current, previous) {
    try {
        // Only process when approval status changes to approved
        if (current.approval_status == 'approved' && previous.approval_status != 'approved') {
            
            // Get visitor information
            var visitorGR = new GlideRecord('x_1248953_vmsystem_visitor');
            if (visitorGR.get(current.visitor)) {
                
                // Get host information
                var hostGR = new GlideRecord('sys_user');
                if (hostGR.get(current.host)) {
                    
                    // Send notification to visitor
                    var visitorMessage = `Dear ${visitorGR.getValue('first_name')} ${visitorGR.getValue('last_name')},\n\n` +
                        `Your visitor request has been approved!\n\n` +
                        `Visit Details:\n` +
                        `- Host: ${hostGR.getDisplayValue()}\n` +
                        `- Start Time: ${current.requested_start_time.getDisplayValue()}\n` +
                        `- End Time: ${current.requested_end_time.getDisplayValue()}\n` +
                        `- Purpose: ${current.purpose_of_visit.getDisplayValue()}\n\n` +
                        `Please arrive at the reception desk 15 minutes before your scheduled time.\n\n` +
                        `Best regards,\nFacility Management Team`;
                    
                    gs.eventQueue('visitor.request.approved', current, visitorGR.getValue('email'), visitorMessage);
                    
                    // Send notification to host
                    var hostMessage = `Hello ${hostGR.getDisplayValue()},\n\n` +
                        `A visitor request you are hosting has been approved:\n\n` +
                        `Visitor: ${visitorGR.getValue('first_name')} ${visitorGR.getValue('last_name')}\n` +
                        `Company: ${visitorGR.getValue('company')}\n` +
                        `Start Time: ${current.requested_start_time.getDisplayValue()}\n` +
                        `End Time: ${current.requested_end_time.getDisplayValue()}\n` +
                        `Purpose: ${current.purpose_of_visit.getDisplayValue()}\n\n` +
                        `Please be available to meet your visitor at the reception area.\n\n` +
                        `Best regards,\nFacility Management Team`;
                    
                    gs.eventQueue('visitor.host.notification', current, hostGR.getValue('email'), hostMessage);
                    
                    // Mark notifications as sent
                    current.notification_sent = true;
                    current.visitor_notified = true;
                    current.update();
                    
                    gs.addInfoMessage('Approval notifications sent to visitor and host.');
                }
            }
        }
        
        // Handle rejection notifications
        if (current.approval_status == 'rejected' && previous.approval_status != 'rejected') {
            
            var visitorGR = new GlideRecord('x_1248953_vmsystem_visitor');
            if (visitorGR.get(current.visitor)) {
                
                var hostGR = new GlideRecord('sys_user');
                if (hostGR.get(current.host)) {
                    
                    var rejectionMessage = `Dear ${visitorGR.getValue('first_name')} ${visitorGR.getValue('last_name')},\n\n` +
                        `We regret to inform you that your visitor request has been rejected.\n\n` +
                        `Reason: ${current.rejection_reason || 'No reason provided'}\n\n` +
                        `If you have any questions, please contact your host: ${hostGR.getDisplayValue()}\n\n` +
                        `Best regards,\nFacility Management Team`;
                    
                    gs.eventQueue('visitor.request.rejected', current, visitorGR.getValue('email'), rejectionMessage);
                    
                    current.visitor_notified = true;
                    current.update();
                }
            }
        }
        
    } catch (error) {
        gs.error('Error in visitor request notification: ' + error.message);
    }
}