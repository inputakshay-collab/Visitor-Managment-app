import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, BooleanColumn, ChoiceColumn } from '@servicenow/sdk/core'

// Meeting room table for managing physical spaces
export const x_1248953_vmsystem_meeting_room = Table({
    name: 'x_1248953_vmsystem_meeting_room',
    label: 'Meeting Room',
    schema: {
        name: StringColumn({ 
            label: 'Room Name', 
            maxLength: 100,
            mandatory: true 
        }),
        location: StringColumn({ 
            label: 'Location/Floor',
            maxLength: 100 
        }),
        capacity: IntegerColumn({ 
            label: 'Capacity',
            min: 1,
            max: 500
        }),
        room_type: ChoiceColumn({
            label: 'Room Type',
            choices: {
                conference: { label: 'Conference Room', sequence: 0 },
                meeting: { label: 'Meeting Room', sequence: 1 },
                boardroom: { label: 'Board Room', sequence: 2 },
                training: { label: 'Training Room', sequence: 3 },
                collaboration: { label: 'Collaboration Space', sequence: 4 }
            },
            dropdown: 'dropdown_with_none'
        }),
        status: ChoiceColumn({
            label: 'Status',
            choices: {
                available: { label: 'Available', sequence: 0 },
                maintenance: { label: 'Under Maintenance', sequence: 1 },
                unavailable: { label: 'Unavailable', sequence: 2 }
            },
            dropdown: 'dropdown_with_none',
            default: 'available'
        }),
        amenities: StringColumn({ 
            label: 'Amenities',
            maxLength: 500
        }),
        has_projector: BooleanColumn({ 
            label: 'Has Projector',
            default: false 
        }),
        has_whiteboard: BooleanColumn({ 
            label: 'Has Whiteboard',
            default: false 
        }),
        has_video_conference: BooleanColumn({ 
            label: 'Has Video Conference',
            default: false 
        }),
        booking_notes: StringColumn({ 
            label: 'Booking Notes',
            maxLength: 1000 
        }),
        active: BooleanColumn({ 
            label: 'Active',
            default: true 
        })
    },
    display: 'name',
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    audit: true
})