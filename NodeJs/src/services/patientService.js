import db from "../models/index";
require('dotenv').config();
import _ from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

let buildUrlEmail = (doctorId, token) => {
    let result = '';

    result = `${process.env.REACT_APP_FRONTEND_URL}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = await db.DatLichKham.findOne({
                where: {
                    maND: data.idUser,
                    lichKham: data.idSchedule,
                }
            })

            if (schedule) {
                resolve({
                    errCode: 2,
                    errMessage: 'Bạn đã đặt khám vào khùng giờ này rồi. Xin cảm ơn quý khách'
                })
            }
            else {
                let orderNumber = await db.LichKham.findOne({
                    where: {
                        id: data.idSchedule
                    },
                    raw: false
                })

                if (orderNumber.soLuongDangDat > 5) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Đã quá số lượng người đặt vui lòng chọn trong khung giờ khác!'
                    })
                }
                else {
                    let checkNumber = 1;
                    if (orderNumber.soLuongDangDat === null) {
                        orderNumber.soLuongDangDat = 1;
                        orderNumber.save();
                    }
                    else {
                        checkNumber = orderNumber.soLuongDangDat + 1;
                        orderNumber.soLuongDangDat = orderNumber.soLuongDangDat + 1;
                        orderNumber.save();
                    }

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
                    if (checkNumber === 1) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Bạn là người đặt lịch đầu tiên. Xin hãy đến đúng giờ đặt. Giờ khám của bạn là 10 phút. Xin cảm ơn!'
                        })
                    }
                    else if (checkNumber === 2) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Bạn là người đặt lịch thứ hai. Xin hãy đến sau 10 phút. Giờ khám của bạn là 10 phút. Xin cảm ơn!'
                        })
                    }
                    else if (checkNumber === 3) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Bạn là người đặt lịch thứ ba. Xin hãy đến sau 20 phút. Giờ khám của bạn là 10 phút. Xin cảm ơn!'
                        })
                    }
                    else if (checkNumber === 4) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Bạn là người đặt lịch thứ tư. Xin hãy đến sau 30 phút. Giờ khám của bạn là 10 phút. Xin cảm ơn!'
                        })
                    }
                    else if (checkNumber === 5) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Bạn là người đặt lịch thứ năm. Xin hãy đến sau 40 phút. Giờ khám của bạn là 10 phút. Xin cảm ơn!'
                        })
                    }
                    else {
                        resolve({
                            errCode: 0,
                            errMessage: 'Bạn là người đặt lịch thứ sáu. Xin hãy đến sau 50 phút. Giờ khám của bạn là 10 phút. Xin cảm ơn!'
                        })
                    }
                }
            }
        }
        catch (e) {
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

let getAllPatientBookSchedule = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.DatLichKham.findAll({
                attributes: [
                    'id', 'createdAt', 'trangThai'
                ],
                raw: false,
                nest: true
            });

            let statistics = {};

            data.forEach(item => {
                let bookingDate = moment(item.createdAt);

                let month = bookingDate.format('MM/YYYY');

                if (!statistics[month]) {
                    statistics[month] = 1;
                } else {
                    statistics[month] += 1;
                }
            });

            resolve({
                errMessage: 'ok',
                errCode: 0,
                data: statistics
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getAllPatientBookAndCancel = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.DatLichKham.findAll({
                attributes: [
                    'id', 'createdAt', 'trangThai'
                ],
                raw: false,
                nest: true
            });
            let statistics = {
                S1: 0,
                S2: 0,

            };
            data.forEach((item) => {
                if (item.trangThai === 'S1' || item.trangThai === 'S2' || item.trangThai === 'S3' || item.trangThai === 'S5') {
                    statistics.S1++;
                } else if (item.trangThai === 'S4') {
                    statistics.S2++;
                }
            });

            resolve({
                errMessage: 'ok',
                errCode: 0,
                data: statistics
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getPatientBookSucceed = (input) => {
    return new Promise(async (resolve, reject) => {
        try {
            let tthai = [];
            if (input.trangThai === "ALL") {
                tthai = ['S1', 'S2', 'S3', 'S4', 'S5']
            }
            else if (input.trangThai === "DL") {
                tthai = ['S1', 'S2', 'S3', 'S5']
            }
            else if (input.trangThai === "HL") {
                tthai = ['S4']
            }
            let data = await db.DatLichKham.findAll({
                where: {
                    trangThai: tthai
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
            });

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
            });
        } catch (e) {
            reject(e);
        }
    });
};

let cancelBookOverdue = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.DatLichKham.findAll({
                include: [
                    {
                        model: db.LichKham, as: 'schedulePatientData',
                    }
                ],
                raw: false,
                nest: true
            });

            data.forEach((item) => {
                const timestamp = parseInt(item.schedulePatientData.ngayKham);
                const bookingDate = moment(timestamp);
                const currentDate = moment();

                // Đặt giờ, phút, giây và mili giây thành 0
                bookingDate.startOf('day');
                currentDate.startOf('day');

                if (item.trangThai === "S1" || item.trangThai === "S2") {
                    if (bookingDate.isBefore(currentDate)) {
                        item.trangThai = "S4";
                        item.save();
                    }
                }
            });

            resolve({
                errMessage: 'ok',
                errCode: 0,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAllBookedByUser,
    getAllBookByUser,
    cancelBook,
    racingBook,
    getAllPatientBookSchedule,
    getAllPatientBookAndCancel,
    getPatientBookSucceed,
    cancelBookOverdue
}