import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, BooleanColumn } from '@servicenow/sdk/core'

// Visitor registration table for managing visitor information
export const x_1248953_vmsystem_visitor = Table({
    name: 'x_1248953_vmsystem_visitor',
    label: 'Visitor',
    schema: {
        first_name: StringColumn({ 
            label: 'First Name', 
            maxLength: 50,
            mandatory: true 
        }),
        last_name: StringColumn({ 
            label: 'Last Name', 
            maxLength: 50,
            mandatory: true 
        }),
        email: StringColumn({ 
            label: 'Email Address',
            maxLength: 100,
            mandatory: true 
        }),
        phone: StringColumn({ 
            label: 'Phone Number',
            maxLength: 20 
        }),
        company: StringColumn({ 
            label: 'Company',
            maxLength: 100,
            mandatory: true 
        }),
        department: StringColumn({ 
            label: 'Department',
            maxLength: 100 
        }),
        photo_id_type: ChoiceColumn({
            label: 'Photo ID Type',
            choices: {
                drivers_license: { label: "Driver's License", sequence: 0 },
                passport: { label: 'Passport', sequence: 1 },
                government_id: { label: 'Government ID', sequence: 2 },
                employee_badge: { label: 'Employee Badge', sequence: 3 },
                other: { label: 'Other', sequence: 4 }
            },
            dropdown: 'dropdown_with_none'
        }),
        photo_id_number: StringColumn({ 
            label: 'Photo ID Number',
            maxLength: 50 
        }),
        emergency_contact_name: StringColumn({ 
            label: 'Emergency Contact Name',
            maxLength: 100 
        }),
        emergency_contact_phone: StringColumn({ 
            label: 'Emergency Contact Phone',
            maxLength: 20 
        }),
        special_requirements: StringColumn({ 
            label: 'Special Requirements',
            maxLength: 500 
        }),
        visitor_badge_number: StringColumn({ 
            label: 'Visitor Badge Number',
            maxLength: 20 
        }),
        is_frequent_visitor: BooleanColumn({ 
            label: 'Frequent Visitor',
            default: false 
        }),
        notes: StringColumn({ 
            label: 'Notes',
            maxLength: 1000 
        }),
        active: BooleanColumn({ 
            label: 'Active',
            default: true 
        })
    },
    display: 'last_name',
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    audit: true,
    index: [
        { name: 'email_idx', element: 'email', unique: false },
        { name: 'company_idx', element: 'company', unique: false }
    ]
})