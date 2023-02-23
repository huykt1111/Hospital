import db from "../models/index";
require('dotenv').config();
import _ from "lodash";
import emailService from "./emailService";

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data.email, data.doctorId, data.timeType, data.date)
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: 'http://localhost:3000/home'
                })
                // upsert patient
                let user = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        }
                    })
                };

                resolve({
                    errCode: 0,
                    errMessage: 'Save succeed!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment
}