import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, DateTimeColumn, ChoiceColumn, BooleanColumn, IntegerColumn } from '@servicenow/sdk/core'

// Meeting room booking table for managing room reservations
export const x_1248953_vmsystem_room_booking = Table({
    name: 'x_1248953_vmsystem_room_booking',
    label: 'Room Booking',
    extends: 'task',
    schema: {
        meeting_room: ReferenceColumn({ 
            label: 'Meeting Room',
            referenceTable: 'x_1248953_vmsystem_meeting_room',
            mandatory: true 
        }),
        booked_by: ReferenceColumn({ 
            label: 'Booked By',
            referenceTable: 'sys_user',
            mandatory: true 
        }),
        visitor_request: ReferenceColumn({ 
            label: 'Related Visitor Request',
            referenceTable: 'x_1248953_vmsystem_visitor_request'
        }),
        meeting_title: StringColumn({ 
            label: 'Meeting Title',
            maxLength: 200,
            mandatory: true 
        }),
        meeting_purpose: StringColumn({ 
            label: 'Meeting Purpose',
            maxLength: 500 
        }),
        start_time: DateTimeColumn({ 
            label: 'Start Time',
            mandatory: true 
        }),
        end_time: DateTimeColumn({ 
            label: 'End Time',
            mandatory: true 
        }),
        expected_attendees: IntegerColumn({ 
            label: 'Expected Attendees',
            min: 1,
            max: 500,
            mandatory: true
        }),
        booking_status: ChoiceColumn({
            label: 'Booking Status',
            choices: {
                pending: { label: 'Pending Approval', sequence: 0 },
                confirmed: { label: 'Confirmed', sequence: 1 },
                in_progress: { label: 'In Progress', sequence: 2 },
                completed: { label: 'Completed', sequence: 3 },
                cancelled: { label: 'Cancelled', sequence: 4 },
                no_show: { label: 'No Show', sequence: 5 }
            },
            dropdown: 'dropdown_with_none',
            default: 'pending'
        }),
        approval_required: BooleanColumn({ 
            label: 'Approval Required',
            default: false 
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
        setup_requirements: StringColumn({ 
            label: 'Setup Requirements',
            maxLength: 1000 
        }),
        catering_required: BooleanColumn({ 
            label: 'Catering Required',
            default: false 
        }),
        catering_details: StringColumn({ 
            label: 'Catering Details',
            maxLength: 500 
        }),
        av_equipment_needed: StringColumn({ 
            label: 'AV Equipment Needed',
            maxLength: 500 
        }),
        recurring_booking: BooleanColumn({ 
            label: 'Recurring Booking',
            default: false 
        }),
        recurring_pattern: ChoiceColumn({
            label: 'Recurring Pattern',
            choices: {
                daily: { label: 'Daily', sequence: 0 },
                weekly: { label: 'Weekly', sequence: 1 },
                biweekly: { label: 'Bi-weekly', sequence: 2 },
                monthly: { label: 'Monthly', sequence: 3 }
            },
            dropdown: 'dropdown_with_none'
        }),
        attendees_list: StringColumn({ 
            label: 'Attendees List',
            maxLength: 1000 
        }),
        meeting_notes: StringColumn({ 
            label: 'Meeting Notes',
            maxLength: 2000 
        }),
        notification_sent: BooleanColumn({ 
            label: 'Confirmation Sent',
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
        prefix: 'RB',
        number: 1000,
        number_of_digits: 7
    }
})