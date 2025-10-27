import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, DateTimeColumn, ChoiceColumn, BooleanColumn } from '@servicenow/sdk/core'

// Visitor registration request table for managing visit requests and approvals
export const x_1248953_vmsystem_visitor_request = Table({
    name: 'x_1248953_vmsystem_visitor_request',
    label: 'Visitor Request',
    extends: 'task',
    schema: {
        visitor: ReferenceColumn({ 
            label: 'Visitor',
            referenceTable: 'x_1248953_vmsystem_visitor',
            mandatory: true 
        }),
        host: ReferenceColumn({ 
            label: 'Host (Employee)',
            referenceTable: 'sys_user',
            mandatory: true 
        }),
        purpose_of_visit: ChoiceColumn({
            label: 'Purpose of Visit',
            choices: {
                business_meeting: { label: 'Business Meeting', sequence: 0 },
                interview: { label: 'Interview', sequence: 1 },
                training: { label: 'Training/Workshop', sequence: 2 },
                consultation: { label: 'Consultation', sequence: 3 },
                delivery: { label: 'Delivery/Service', sequence: 4 },
                tour: { label: 'Facility Tour', sequence: 5 },
                contractor: { label: 'Contractor Work', sequence: 6 },
                other: { label: 'Other', sequence: 7 }
            },
            dropdown: 'dropdown_with_none',
            mandatory: true
        }),
        visit_reason_details: StringColumn({ 
            label: 'Visit Reason Details',
            maxLength: 500 
        }),
        requested_start_time: DateTimeColumn({ 
            label: 'Requested Start Time',
            mandatory: true 
        }),
        requested_end_time: DateTimeColumn({ 
            label: 'Requested End Time',
            mandatory: true 
        }),
        actual_arrival_time: DateTimeColumn({ 
            label: 'Actual Arrival Time'
        }),
        actual_departure_time: DateTimeColumn({ 
            label: 'Actual Departure Time'
        }),
        approval_status: ChoiceColumn({
            label: 'Approval Status',
            choices: {
                pending: { label: 'Pending Approval', sequence: 0 },
                approved: { label: 'Approved', sequence: 1 },
                rejected: { label: 'Rejected', sequence: 2 },
                cancelled: { label: 'Cancelled', sequence: 3 }
            },
            dropdown: 'dropdown_with_none',
            default: 'pending'
        }),
        approved_by: ReferenceColumn({ 
            label: 'Approved By',
            referenceTable: 'sys_user'
        }),
        approval_date: DateTimeColumn({ 
            label: 'Approval Date'
        }),
        rejection_reason: StringColumn({ 
            label: 'Rejection Reason',
            maxLength: 500 
        }),
        check_in_status: ChoiceColumn({
            label: 'Check-in Status',
            choices: {
                not_arrived: { label: 'Not Arrived', sequence: 0 },
                checked_in: { label: 'Checked In', sequence: 1 },
                checked_out: { label: 'Checked Out', sequence: 2 },
                no_show: { label: 'No Show', sequence: 3 }
            },
            dropdown: 'dropdown_with_none',
            default: 'not_arrived'
        }),
        security_escort_required: BooleanColumn({ 
            label: 'Security Escort Required',
            default: false 
        }),
        access_areas: StringColumn({ 
            label: 'Authorized Access Areas',
            maxLength: 500 
        }),
        parking_required: BooleanColumn({ 
            label: 'Parking Required',
            default: false 
        }),
        parking_spot: StringColumn({ 
            label: 'Assigned Parking Spot',
            maxLength: 20 
        }),
        notification_sent: BooleanColumn({ 
            label: 'Notification Sent to Host',
            default: false 
        }),
        visitor_notified: BooleanColumn({ 
            label: 'Visitor Notified',
            default: false 
        })
    },
    display: 'number',
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    audit: true,
    auto_number: {
        prefix: 'VR',
        number: 1000,
        number_of_digits: 7
    }
})