import db from "../models/index";
require('dotenv').config();
import _ from "lodash";
import emailService from "./emailService";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let saveDetailInfomationDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (inputData && inputData.id !== null) {
                if (inputData.avatar !== null) {
                    let user = await db.TaiKhoan.findOne({
                        where: { id: inputData.id },
                        raw: false
                    });
                    if (user) {
                        user.hinhAnh = inputData.avatar;
                        await user.save();
                    }
                }

                await db.ThongTinBacSi.create({
                    maTk: inputData.id,
                    chuyenKhoa: inputData.selectedSpecialty,
                    phongKham: inputData.selectedClinic,
                    chucDanh: inputData.position,
                    giaKham: inputData.selectedPrice,
                    khuVucLamViec: inputData.selectedProvince,
                    phuongThucThanhToan: inputData.selectedPayment,
                    diaChiPhongKham: inputData.addressClinic,
                    tenPhongKham: inputData.nameClinic,
                    ghiChu: inputData.note,
                    mieuTa: inputData.description,
                    noiDungHTML: inputData.contentHtml,
                    noiDungMarkdown: inputData.contentMarkdown,
                    trangThai: 1,
                })

                resolve({
                    errCode: 0,
                    errorMessage: 'Register infor doctor succeed!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateDetailInfomationDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (inputData && inputData.id !== null) {
                if (inputData.avatar !== null) {
                    let user = await db.TaiKhoan.findOne({
                        where: { id: inputData.id },
                        raw: false
                    });
                    if (user) {
                        if (inputData.avatar !== '') {
                            user.hinhAnh = inputData.avatar;
                            await user.save();
                        }
                    }
                }

                let doctor = await db.ThongTinBacSi.findOne({
                    where: { maTk: inputData.id },
                    raw: false
                });

                if (doctor) {
                    doctor.chuyenKhoa = inputData.selectedSpecialty;
                    doctor.phongKham = inputData.selectedClinic;
                    doctor.chucDanh = inputData.position;
                    doctor.giaKham = inputData.selectedPrice;
                    doctor.khuVucLamViec = inputData.selectedProvince;
                    doctor.phuongThucThanhToan = inputData.selectedPayment;
                    doctor.diaChiPhongKham = inputData.addressClinic;
                    doctor.tenPhongKham = inputData.nameClinic;
                    doctor.ghiChu = inputData.note;
                    doctor.mieuTa = inputData.description;
                    doctor.noiDungHTML = inputData.contentHtml;
                    doctor.noiDungMarkdown = inputData.contentMarkdown;
                    await doctor.save();
                    resolve({
                        errCode: 0,
                        errorMessage: 'Update succeed!'
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        errorMessage: 'Not found doctor!'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllRegisterDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let doctor = await db.ThongTinBacSi.findAll({
                where: {
                    trangThai: 1
                },
                include: [
                    {
                        model: db.TaiKhoan,
                    },
                    {
                        model: db.PhongKham, as: 'userClinicData', attributes: ['id', 'tenPhongKham', 'diaChi']
                    },
                    {
                        model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                    },
                    { model: db.Allcode, as: 'priceIdData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'provinceIdData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'paymentIdData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true
            })

            if (doctor && doctor.length > 0) {
                doctor.map(item => {
                    item.TaiKhoan.hinhAnh = new Buffer(item.TaiKhoan.hinhAnh, 'base64').toString('binary');
                    return item;
                })
            }

            if (!doctor) doctor = {};

            resolve({
                errCode: 0,
                data: doctor
            })
        } catch (e) {
            reject(e);
        }
    })
}

let ratifyDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.maTk !== null) {
                let user = await db.ThongTinBacSi.findOne({
                    where: { maTk: data.maTk },
                    raw: false
                });
                if (user) {
                    user.trangThai = 2;
                    await user.save();
                }

                let taikhoan = await db.TaiKhoan.findOne({
                    where: { id: data.maTk },
                    raw: false
                });

                if (taikhoan) {
                    taikhoan.vaiTro = 'R2';
                    await taikhoan.save();
                }

                resolve({
                    errCode: 0,
                    errorMessage: 'Ratify register doctor succeed!'
                })
            }
            else {
                resolve({
                    errCode: 0,
                    errorMessage: 'Ratify register doctor faided!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let refuseDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.maTk !== null) {
                let user = await db.ThongTinBacSi.findOne({
                    where: { maTk: data.maTk },
                    raw: false
                });
                if (user) {
                    user.trangThai = 0;
                    await user.save();
                }

                resolve({
                    errCode: 0,
                    errorMessage: 'Refuse register doctor succeed!'
                })
            }
            else {
                resolve({
                    errCode: 0,
                    errorMessage: 'Refuse register doctor faided!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getTopDoctorHome = (limit) => {

    return new Promise(async (resolve, reject) => {
        try {

            let doctor = await db.ThongTinBacSi.findAll({

                where: {
                    trangThai: 2
                },

                include: [
                    {
                        model: db.TaiKhoan,
                        where: {
                            vaiTro: "R2",
                            trangThai: 1
                        }
                    },
                    {
                        model: db.PhongKham, as: 'userClinicData', attributes: ['tenPhongKham', 'diaChi', 'mieuTaHtml', 'mieuTaMarkDown']
                    },
                    {
                        model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                    },
                    { model: db.Allcode, as: 'priceIdData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'provinceIdData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'paymentIdData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.LichKham, as: 'dataDoctorLK', attributes: ['maTk'],
                        include: [
                            {
                                model: db.DatLichKham, as: 'schedulePatientData'
                            },
                        ]
                    },
                ],
                attributes: [
                    'maTk', 'tenPhongKham',
                    [db.sequelize.literal('(SELECT COUNT(*) FROM DatLichKhams WHERE DatLichKhams.maBS = ThongTinBacSi.maTk)'), 'bookingCount']
                ],
                order: [[db.sequelize.literal('bookingCount'), 'DESC']],
                raw: false,
                nest: true
            })


            if (doctor && doctor.length > 0) {
                doctor = doctor.slice(0, limit);

                doctor.map(item => {
                    item.TaiKhoan.hinhAnh = new Buffer(item.TaiKhoan.hinhAnh, 'base64').toString('binary');
                    return item;
                })
            }

            if (!doctor) doctor = {};

            resolve({
                errCode: 0,
                data: doctor
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.ThongTinBacSi.findAll({
                where: {
                    trangThai: 2
                },
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: db.TaiKhoan,
                        where: {
                            vaiTro: "R2",
                            trangThai: 1
                        }
                    },
                    {
                        model: db.PhongKham, as: 'userClinicData', attributes: ['tenPhongKham', 'diaChi', 'mieuTaHtml', 'mieuTaMarkDown']
                    },
                    {
                        model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                    },
                    { model: db.Allcode, as: 'priceIdData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'provinceIdData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'paymentIdData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true
            })

            if (doctor && doctor.length > 0) {
                doctor.map(item => {
                    item.TaiKhoan.hinhAnh = new Buffer(item.TaiKhoan.hinhAnh, 'base64').toString('binary');
                    return item;
                })
            }

            if (!doctor) doctor = {};

            resolve({
                errCode: 0,
                data: doctor
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.ThongTinBacSi.findOne({
                    where: {
                        maTk: inputId,
                        trangThai: 2
                    },
                    include: [
                        {
                            model: db.TaiKhoan,
                        },
                        {
                            model: db.PhongKham, as: 'userClinicData', attributes: ['tenPhongKham', 'diaChi', 'mieuTaHtml', 'mieuTaMarkDown']
                        },
                        {
                            model: db.LichKham, as: 'dataDoctorLK', attributes: ['maTk', 'ngayKham'],
                            include: [
                                {
                                    model: db.DatLichKham, as: 'schedulePatientData',
                                    // where: {
                                    //     trangThai: 'S5'
                                    // }
                                },
                            ]
                        },
                        {
                            model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                        },
                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentIdData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.TaiKhoan.hinhAnh) {
                    data.TaiKhoan.hinhAnh = new Buffer(data.TaiKhoan.hinhAnh, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.maTk || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let schedule = data.arrSchedule;
                let existing = await db.LichKham.findAll({
                    where: {
                        maTk: data.maTk,
                        ngayKham: data.formattedDate
                    },
                    attributes: ['thoiGianKham', 'ngayKham', 'maTk', 'soLuongDangDat'],
                    raw: true
                })

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.thoiGianKham === b.thoiGianKham && +a.ngayKham === +b.ngayKham;
                });
                if (toCreate && toCreate.length > 0) {
                    await db.LichKham.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: "Ok"
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            }
            else {
                let dataSchedule = await db.LichKham.findAll({
                    where: {
                        maTk: doctorId,
                        ngayKham: date
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.TaiKhoan, as: 'doctorData', attributes: ['ho', 'ten']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            }
            else {
                let data = await db.ThongTinBacSi.findOne({
                    where: {
                        maTk: doctorId,
                        trangThai: 2
                    },
                    include: [
                        {
                            model: db.TaiKhoan,
                        },
                        {
                            model: db.PhongKham, as: 'userClinicData', attributes: ['tenPhongKham', 'diaChi', 'mieuTaHtml', 'mieuTaMarkDown']
                        },
                        {
                            model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                        },
                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentIdData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.TaiKhoan.hinhAnh) {
                    data.TaiKhoan.hinhAnh = new Buffer(data.TaiKhoan.hinhAnh, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let data = await db.ThongTinBacSi.findOne({
                    where: {
                        maTk: inputId,
                        trangThai: 2
                    },
                    include: [
                        {
                            model: db.TaiKhoan,
                        },
                        {
                            model: db.PhongKham, as: 'userClinicData', attributes: ['tenPhongKham', 'diaChi', 'mieuTaHtml', 'mieuTaMarkDown']
                        },
                        {
                            model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                        },
                        { model: db.Allcode, as: 'priceIdData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceIdData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentIdData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.TaiKhoan.hinhAnh) {
                    data.TaiKhoan.hinhAnh = new Buffer(data.TaiKhoan.hinhAnh, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let data = await db.DatLichKham.findAll({
                    where: {
                        trangThai: 'S2',
                        maBS: doctorId,
                    },
                    include: [
                        {
                            model: db.LichKham, as: 'schedulePatientData',
                            where: {
                                ngayKham: date
                            },
                            include: [
                                {
                                    model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'genderDataDLK', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            } else {
                let appointment = await db.DatLichKham.findOne({
                    where: {
                        maBS: data.doctorId,
                        maND: data.patientId,
                        trangThai: 'S2'
                    },
                    include: [
                        {
                            model: db.LichKham, as: 'schedulePatientData',
                            where: {
                                ngayKham: data.date,
                                thoiGianKham: data.timeType
                            },
                        }
                    ],
                    raw: false
                })
                if (appointment) {
                    appointment.ngayTaiKham = data.ngayTaiKham;
                    appointment.fileDinhKem = data.imgBase64;
                    appointment.keDonThuoc = data.donThuoc;
                    appointment.trangThai = 'S3';
                    await appointment.save();
                }

                await emailService.sendAttachment(data);

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfomationDoctor: saveDetailInfomationDoctor,
    getDetailDoctor: getDetailDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
    getAllRegisterDoctors,
    ratifyDoctor,
    refuseDoctor,
    updateDetailInfomationDoctor
}