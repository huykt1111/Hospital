export const adminMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.user-account', link: '/system/user-manage',
            },
        ]
    },
    {
        name: 'menu.admin.doctor', menus: [
            {
                name: 'menu.admin.doctor-register', link: '/system/manage-doctor',

            },
        ]
    },
    {
        name: 'menu.admin.clinic', menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic',
            },
            {
                name: 'menu.admin.ratify-clinic', link: '/system/ratify-clinic',

            },
        ]
    },
    {
        name: 'menu.admin.specialty', menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty',
            },
            {
                name: 'menu.admin.ratify-specialty', link: '/system/ratify-specialty',

            },
        ]
    },
    {
        name: 'menu.admin.handbook', menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook'
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.account',
        menus: [
            {
                name: 'menu.doctor.update-profile-doctor', link: '/doctor/update-profile-doctor',
            },
            {
                name: 'menu.doctor.update-profile', link: '/doctor/update-profile',
            },
        ]

    },
    {
        name: 'menu.doctor.manage-schedule',
        menus: [
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule',
            },
        ]

    },
    {
        name: 'menu.doctor.manage-patient',
        menus: [
            {
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient',
            },
        ]
    },
    {
        name: 'menu.doctor.clinic-register',
        menus: [
            {
                name: 'menu.doctor.clinic-register', link: '/doctor/register-clinic'
            },
        ]
    },
    {
        name: 'menu.doctor.specialty-register',
        menus: [
            {
                name: 'menu.doctor.specialty-register', link: '/doctor/register-specialty'
            },
        ]
    },
];