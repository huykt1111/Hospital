export const adminMenu = [
    { //manage user
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.user-account', link: '/system/user-manage',
            },
        ]
    },
    { //manage clinic
        name: 'menu.admin.doctor', menus: [
            {
                name: 'menu.admin.doctor-register', link: '/system/manage-doctor',

            },
        ]
    },
    { //manage clinic
        name: 'menu.admin.clinic', menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic',
            },
            {
                name: 'menu.admin.clinic-register'
            },
        ]
    },
    { //manage specialty
        name: 'menu.admin.specialty', menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty',
            },
            {
                name: 'menu.admin.specialty-register'
            },
        ]
    },
    { //manage handbook
        name: 'menu.admin.handbook', menus: [
            {
                name: 'menu.admin.manage-handbook'
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.manage-schedule',
        menus: [
            { //manage doctor's schedule
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule',
            },
        ]

    },
    { //manage handbook
        name: 'menu.doctor.manage-patient',
        menus: [
            { //Patient management of doctor's examination
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient',
            },
        ]
    },

];