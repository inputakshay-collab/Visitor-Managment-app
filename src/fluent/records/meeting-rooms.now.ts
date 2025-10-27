import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Sample meeting rooms for demonstration
export const meetingRoom1 = Record({
    $id: Now.ID['meeting_room_1'],
    table: 'x_1248953_vmsystem_meeting_room',
    data: {
        name: 'Conference Room A',
        location: '2nd Floor - East Wing',
        capacity: 12,
        room_type: 'conference',
        status: 'available',
        amenities: 'Projector, Whiteboard, Video Conference, Coffee Station',
        has_projector: true,
        has_whiteboard: true,
        has_video_conference: true,
        booking_notes: 'Book at least 2 hours in advance',
        active: true
    }
})

export const meetingRoom2 = Record({
    $id: Now.ID['meeting_room_2'],
    table: 'x_1248953_vmsystem_meeting_room',
    data: {
        name: 'Board Room',
        location: '3rd Floor - Executive Wing',
        capacity: 20,
        room_type: 'boardroom',
        status: 'available',
        amenities: 'Large Screen Display, Premium AV Equipment, Executive Seating',
        has_projector: true,
        has_whiteboard: false,
        has_video_conference: true,
        booking_notes: 'Executive approval required for bookings',
        active: true
    }
})

export const meetingRoom3 = Record({
    $id: Now.ID['meeting_room_3'],
    table: 'x_1248953_vmsystem_meeting_room',
    data: {
        name: 'Training Room 1',
        location: '1st Floor - Training Center',
        capacity: 30,
        room_type: 'training',
        status: 'available',
        amenities: 'Multiple Screens, Flip Charts, Training Materials Storage',
        has_projector: true,
        has_whiteboard: true,
        has_video_conference: false,
        booking_notes: 'Ideal for workshops and training sessions',
        active: true
    }
})

export const meetingRoom4 = Record({
    $id: Now.ID['meeting_room_4'],
    table: 'x_1248953_vmsystem_meeting_room',
    data: {
        name: 'Collaboration Hub',
        location: '2nd Floor - Open Area',
        capacity: 8,
        room_type: 'collaboration',
        status: 'available',
        amenities: 'Flexible Seating, Writable Walls, Casual Environment',
        has_projector: false,
        has_whiteboard: true,
        has_video_conference: false,
        booking_notes: 'Perfect for brainstorming and informal meetings',
        active: true
    }
})