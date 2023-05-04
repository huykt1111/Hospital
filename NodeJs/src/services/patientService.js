import db from "../models/index";
require('dotenv').config();
import _ from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = '';

    result = `${process.env.REACT_APP_FRONTEND_URL}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data)


            let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

            await emailService.sendSimpleEmail({
                receiverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token)
            })

            await db.DatLichKham.create({
                maBS: data.doctorId,
                maND: data.idUser,
                lichKham: data.idSchedule,
                hoTen: data.fullName,
                soDienThoai: data.phoneNumber,
                email: data.email,
                gioiTinh: data.selectedGender,
                diaChi: data.address,
                ngaySinh: data.birthday,
                birthday: data.selectedGender,
                lyDoKham: data.reason,
                token: token,
                trangThai: 'S1'
            })
            // upsert patient

            resolve({
                errCode: 0,
                errMessage: 'Save succeed!'
            })
        } catch (e) {
            reject(e);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
            else {
                let appointment = await db.DatLichKham.findOne({
                    where: {
                        maBS: data.doctorId,
                        token: data.token,
                        trangThai: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.trangThai = 'S2'
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update the appointment succeed!"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or does not exist!"
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllBookedByUser = (UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!UserId.id_user) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let data = await db.DatLichKham.findAll({
                    where: {
                        maND: UserId.id_user,
                        trangThai: 'S2',
                    },
                    include: [
                        {
                            model: db.LichKham, as: 'schedulePatientData',
                            include: [
                                {
                                    model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.TaiKhoan, as: 'doctorData'
                                },
                                {
                                    model: db.ThongTinBacSi, as: 'dataDoctorLK',
                                    include: [
                                        {
                                            model: db.PhongKham, as: 'userClinicData', attributes: ['tenPhongKham', 'diaChi', 'mieuTaHtml', 'mieuTaMarkDown']
                                        },
                                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueEn', 'valueVi'] },
                                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueEn', 'valueVi'] },
                                        { model: db.Allcode, as: 'paymentIdData', attributes: ['valueEn', 'valueVi'] },
                                    ]
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'genderDataDLK', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.TaiKhoan, as: 'patientData', attributes: ['ho', 'ten']
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.length > 0) {
                    data.map(item => {
                        if (item.schedulePatientData.doctorData.hinhAnh !== null) {
                            item.schedulePatientData.doctorData.hinhAnh = new Buffer(item.schedulePatientData.doctorData.hinhAnh, 'base64').toString('binary');
                        }
                        return item;
                    })
                }

                if (!data) data = []

                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllBookByUser = (UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!UserId.id_user) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let data = await db.DatLichKham.findAll({
                    where: {
                        maND: UserId.id_user,
                        trangThai: ['S3', 'S5'],
                    },
                    include: [
                        {
                            model: db.LichKham, as: 'schedulePatientData',
                            include: [
                                {
                                    model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.TaiKhoan, as: 'doctorData'
                                },
                                {
                                    model: db.ThongTinBacSi, as: 'dataDoctorLK',
                                    include: [
                                        {
                                            model: db.PhongKham, as: 'userClinicData', attributes: ['tenPhongKham', 'diaChi', 'mieuTaHtml', 'mieuTaMarkDown']
                                        },
                                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueEn', 'valueVi'] },
                                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueEn', 'valueVi'] },
                                        { model: db.Allcode, as: 'paymentIdData', attributes: ['valueEn', 'valueVi'] },
                                    ]
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'genderDataDLK', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.TaiKhoan, as: 'patientData', attributes: ['ho', 'ten']
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.length > 0) {
                    data.map(item => {
                        if (item.schedulePatientData.doctorData.hinhAnh !== null) {
                            item.schedulePatientData.doctorData.hinhAnh = new Buffer(item.schedulePatientData.doctorData.hinhAnh, 'base64').toString('binary');
                        }
                        return item;
                    })
                }

                if (!data) data = []

                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let cancelBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let book = await db.DatLichKham.findOne({
                    where: { id: data.id },
                    raw: false
                });

                if (book) {
                    book.trangThai = 'S4'

                    await book.save();

                    resolve({
                        errCode: 0,
                        message: 'Update the book success!'
                    })
                }
                else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Book not found!'
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let racingBook = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log(data);
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let racing = await db.DatLichKham.findOne({
                    where: { id: data.id },
                    raw: false
                });

                if (racing) {
                    racing.danhGia = data.comment;
                    racing.start = data.start;
                    racing.trangThai = 'S5'

                    await racing.save();

                    resolve({
                        errCode: 0,
                        message: 'Racing the book success!'
                    })
                }
                else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Book not found!'
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAllBookedByUser,
    getAllBookByUser,
    cancelBook,
    racingBook
}